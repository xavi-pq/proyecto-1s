import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const Inicio = () => {
  const [cargando, setCargando] = useState(true);
  const [fechaDesde, setFechaDesde] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }));
  const [fechaHasta, setFechaHasta] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }));
  
  const graficoHoraRef = useRef(null);
  const graficoCategoriaRef = useRef(null);

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ventasEfectivo: 0,
    ventasTarjeta: 0,
    productosVendidos: 0,
    montoProductos: 0,
    cantidadVentas: 0,
    ventasPorHora: [],
    ventasPorCategoria: []
  });

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);
      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      const { data: pedidos, error } = await supabase
        .from("pedidos")
        .select("id_pedido, total, fecha")
        .gte("fecha", inicioRango)
        .lte("fecha", finRango);

      if (error) throw error;

      const idsPedidos = pedidos?.map(p => p.id_pedido) || [];

      let productosVendidos = 0;
      let montoProductos = 0;
      let ventasPorCategoria = [];

      if (idsPedidos.length > 0) {
        const { data: detalles } = await supabase
          .from("detalle_pedido")
          .select(`
            cantidad, 
            subtotal,
            productos (
              nombre,
              categorias (nombre_categoria)
            )
          `)
          .in("pedido_id", idsPedidos);

        detalles?.forEach(d => {
          productosVendidos += d.cantidad || 0;
          montoProductos += d.subtotal || 0;

          const categoria = d.productos?.categorias?.nombre_categoria || "Sin categoría";
          const existente = ventasPorCategoria.find(c => c.name === categoria);
          
          if (existente) {
            existente.value += d.subtotal || 0;
          } else {
            ventasPorCategoria.push({ name: categoria, value: d.subtotal || 0 });
          }
        });

        ventasPorCategoria.sort((a, b) => b.value - a.value);
      }

      const totalVentas = pedidos?.reduce((sum, p) => sum + (p.total || 0), 0) || 0;

      const horaMap = Array(24).fill(0);
      pedidos?.forEach(pedido => {
        if (!pedido.fecha) return;
        const hora = new Date(pedido.fecha).getHours();
        if (hora >= 0 && hora < 24) horaMap[hora] += pedido.total || 0;
      });

      const ventasPorHora = [];
      let acumulado = 0;
      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];
        ventasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado)
        });
      }

      setEstadisticas({
        totalVentas,
        ventasEfectivo: 0,
        ventasTarjeta: 0,
        productosVendidos,
        montoProductos,
        cantidadVentas: pedidos?.length || 0,
        ventasPorHora,
        ventasPorCategoria
      });
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setCargando(false);
    }
  };

  const generarPdfVentasHora = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Título y fecha
      pdf.setFontSize(18);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Hora", 14, 15);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);
      
      // Imagen del gráfico
      if (graficoHoraRef.current) {
        const canvas = await html2canvas(graficoHoraRef.current);
        const imagen = canvas.toDataURL('image/png');
        pdf.addImage(imagen, "PNG", 10, 30, 190, 80);
      }
      
      // Resumen general
      pdf.setFontSize(14);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", 14, 115);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);
      
      pdf.text(`Total Ventas: C$ ${estadisticas.totalVentas.toFixed(2)}`, 14, 125);
      pdf.text(`Ventas Efectivo: C$ ${estadisticas.ventasEfectivo.toFixed(2)}`, 14, 132);
      pdf.text(`Ventas Tarjeta: C$ ${estadisticas.ventasTarjeta.toFixed(2)}`, 14, 139);
      pdf.text(`Productos Vendidos: ${estadisticas.productosVendidos}`, 14, 146);
      pdf.text(`Cantidad Ventas: ${estadisticas.cantidadVentas}`, 14, 153);
      
      // Tabla de ventas por hora
      const filas = estadisticas.ventasPorHora.map(item => [
        item.hora,
        `C$ ${item.total}`
      ]);
      
      autoTable(pdf, {
        startY: 160,
        head: [['Hora', 'Monto Acumulado']],
        body: filas
      });
      
      // Descargar PDF
      const fechaActual = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Managua' });
      pdf.save(`VentasHora_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF de Ventas por Hora");
    }
  };

  const generarPdfVentasCategoria = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      pdf.setFontSize(18);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Categoría", 14, 15);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);
      
      if (graficoCategoriaRef.current) {
        const canvas = await html2canvas(graficoCategoriaRef.current);
        const imagen = canvas.toDataURL('image/png');
        pdf.addImage(imagen, "PNG", 10, 30, 190, 80);
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Detalle de Categorías", 14, 115);
      
      const filas = estadisticas.ventasPorCategoria.map(item => [
        item.name,
        `C$ ${item.value.toFixed(2)}`
      ]);
      
      autoTable(pdf, {
        startY: 120,
        head: [['Categoría', 'Total Vendido']],
        body: filas.length > 0 ? filas : [['Sin datos', 'C$ 0.00']]
      });
      
      const fechaActual = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Managua' });
      pdf.save(`VentasCategoria_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF de Ventas por Categoría");
    }
  };

  const generarPdfEstadisticaGeneral = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      pdf.setFontSize(20);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Estadísticas Generales", 14, 18);
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#555555");
      pdf.setFontSize(10);
      pdf.text(`Generado el: ${new Date().toLocaleString('es-NI')}`, 14, 25);
      pdf.text(`Periodo del reporte: ${fechaDesde} al ${fechaHasta}`, 14, 30);
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(3, 7, 117);
      pdf.line(14, 33, 196, 33);
      
      pdf.setFontSize(14);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen Financiero", 14, 42);
      
      const resumenData = [
        ["Concepto", "Valor"],
        ["Total de Ventas", `C$ ${estadisticas.totalVentas.toFixed(2)}`],
        ["Ventas en Efectivo", `C$ ${estadisticas.ventasEfectivo.toFixed(2)}`],
        ["Ventas con Tarjeta", `C$ ${estadisticas.ventasTarjeta.toFixed(2)}`],
        ["Monto Productos Vendidos", `C$ ${estadisticas.montoProductos.toFixed(2)}`],
        ["Cantidad de Ventas Realizadas", `${estadisticas.cantidadVentas}`],
        ["Productos Totales Vendidos", `${estadisticas.productosVendidos}`]
      ];
      
      autoTable(pdf, {
        startY: 47,
        head: [resumenData[0]],
        body: resumenData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [3, 7, 117] }
      });
      
      // Ventas por Categoría
      pdf.setFontSize(14);
      pdf.setTextColor("#030775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Distribución por Categorías", 14, pdf.lastAutoTable.finalY + 15);
      
      const filasCat = estadisticas.ventasPorCategoria.map(item => [
        item.name,
        `C$ ${item.value.toFixed(2)}`
      ]);
      
      autoTable(pdf, {
        startY: pdf.lastAutoTable.finalY + 20,
        head: [['Categoría', 'Total Vendido']],
        body: filasCat.length > 0 ? filasCat : [['Sin datos', 'C$ 0.00']],
        theme: 'grid',
        headStyles: { fillColor: [255, 105, 180] }
      });
      
      const fechaActual = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Managua' });
      pdf.save(`EstadisticaGeneral_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando reporte general PDF");
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);
      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: pedidos, error: errorPedidos } = await supabase
        .from("pedidos")
        .select(`id_pedido, fecha, total, estado, id_empleado, cliente_id`)
        .gte("fecha", inicioRango)
        .lte("fecha", finRango)
        .order("fecha", { ascending: false });

      if (errorPedidos) throw errorPedidos;

      const idsPedidos = pedidos?.map(p => p.id_pedido) || [];
      let detallesVenta = [];

      if (idsPedidos.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalle_pedido")
          .select(`
            id_detalle_pedido,
            pedido_id,
            cantidad,
            precio_unitario,
            subtotal,
            producto_id,
            productos (nombre, categorias (nombre_categoria))
          `)
          .in("pedido_id", idsPedidos)
          .order("pedido_id");

        if (errorDetalles) console.error("Error en detalles:", errorDetalles);
        else detallesVenta = detalles || [];
      }

      const wb = XLSX.utils.book_new();

      if (pedidos && pedidos.length > 0) {
        const wsVentas = XLSX.utils.json_to_sheet(pedidos);
        XLSX.utils.book_append_sheet(wb, wsVentas, "Pedidos");
      } else {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Mensaje: "No hay pedidos en este rango" }]), "Pedidos");
      }

      if (detallesVenta && detallesVenta.length > 0) {
        const wsDetalles = XLSX.utils.json_to_sheet(detallesVenta);
        XLSX.utils.book_append_sheet(wb, wsDetalles, "Detalles_Pedidos");
      } else {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Mensaje: "No hay detalles" }]), "Detalles_Pedidos");
      }

      XLSX.writeFile(wb, `Reporte_Pedidos_${fechaDesde}_a_${fechaHasta}.xlsx`);

    } catch (err) {
      console.error("Error generando Excel:", err);
      alert("Error al generar el Excel. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  const COLORES = ["#5e26b2", "#39ff95", "#ff6bc6", "#8b46ff", "#00d4ff", "#ffd93d"];

  if (cargando) {
    return (
      <Container className="text-center margen-superior-main py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Cargando estadísticas...</p>
      </Container>
    );
  }

  return (
    <div className="animate-fade-in margen-superior-main pb-5">
      <Container>
        <div className="mt-2">
          <div className="mb-4">
            <h2>Dashboard</h2>
            <h6>Estadísticas del Negocio</h6>
          </div>

          <Row className="mb-4 align-items-end g-3">
            <Col xs={6} md={3}>
              <Form.Group>
                <Form.Label>Desde</Form.Label>
                <Form.Control type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group>
                <Form.Label>Hasta</Form.Label>
                <Form.Control type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end gap-2">
              <Button variant="success" onClick={descargarExcel} className="w-100 w-md-auto">
                <i className="bi bi-file-earmark-excel me-2"></i>
                Descargar Excel
              </Button>
              <Button variant="danger" onClick={generarPdfEstadisticaGeneral} className="w-100 w-md-auto">
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Descargar PDF General
              </Button>
            </Col>
          </Row>

          {/* Tarjetas */}
          <Row className="g-4 mb-5">
            <Col md={6} lg={3}>
              <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #28a745, #34ce57)" }}>
                <Card.Body>
                  <h5>Ventas Totales</h5>
                  <h2>C$ {estadisticas.totalVentas.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #0166d3, #3399ff)" }}>
                <Card.Body>
                  <h5>Efectivo</h5>
                  <h2>C$ {estadisticas.ventasEfectivo.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #5ea5f1, #94c0ec)" }}>
                <Card.Body>
                  <h5>Tarjeta</h5>
                  <h2>C$ {estadisticas.ventasTarjeta.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #e27d01, #ffa500)" }}>
                <Card.Body>
                  <h5>Productos Vendidos</h5>
                  <h2>{estadisticas.productosVendidos}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Gráficos */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow border-0">
                <Card.Body ref={graficoHoraRef}>
                  <h5 className="mb-3">Ventas por Hora</h5>
                  <ResponsiveContainer width="100%" height={360}>
                    <LineChart data={estadisticas.ventasPorHora}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis tickFormatter={(v) => `C$${v}`} />
                      <Tooltip formatter={(v) => [`C$ ${v}`, "Monto"]} />
                      <Line type="monotone" dataKey="total" stroke="#5e26b2" strokeWidth={4} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
                <div className="p-3 text-center border-top">
                  <Button variant="outline-danger" onClick={generarPdfVentasHora}>
                    <i className="bi bi-file-earmark-pdf me-2"></i>Descargar PDF
                  </Button>
                </div>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow border-0">
                <Card.Body ref={graficoCategoriaRef}>
                  <h5 className="mb-3">Ventas por Categoría</h5>
                  <ResponsiveContainer width="100%" height={360}>
                    <PieChart>
                      <Pie
                        data={estadisticas.ventasPorCategoria.length > 0 ? estadisticas.ventasPorCategoria : [{ name: "Sin datos", value: 1 }]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={110}
                        label
                      >
                        {estadisticas.ventasPorCategoria.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={COLORES[i % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `C$ ${v}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
                <div className="p-3 text-center border-top">
                  <Button variant="outline-danger" onClick={generarPdfVentasCategoria}>
                    <i className="bi bi-file-earmark-pdf me-2"></i>Descargar PDF
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Inicio;