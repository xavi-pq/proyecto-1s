import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import TablaVentas from "../components/ventas/TablaVentas";
import TarjetaVenta from "../components/ventas/TarjetaVenta";
import FormularioVenta from "../components/ventas/FormularioVenta";

const Ventas = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [detalles, setDetalles] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Cargar datos
  const cargarDatosAuxiliares = async () => {
    try {
      const [c, e, p] = await Promise.all([
        supabase.from("clientes").select("*"),
        supabase.from("empleados").select("*"),
        supabase.from("productos").select("*")
      ]);
      setClientes(c.data || []);
      setEmpleados(e.data || []);
      setProductos(p.data || []);
    } catch (err) {
      console.error("Error cargando auxiliares:", err);
    }
  };

  const cargarVentas = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("ventas")
        .select(`
          *,
          clientes (nombre, apellido),
          empleados (nombre_empleado, apellido_empleado),
          detalles_ventas (*, productos (nombre, precio))
        `)
        .order("fecha_venta", { ascending: false });

      if (error) {
        console.error("Error al cargar ventas:", error);
        setToast({ mostrar: true, mensaje: "Error al cargar ventas", tipo: "error" });
        return;
      }
      setVentas(data || []);
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar ventas", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVentas();
    cargarDatosAuxiliares();
  }, []);

  // Precargar formulario al editar
  useEffect(() => {
    if (ventaAEditar) {
      const cliente = clientes.find(c => c.id_cliente === ventaAEditar.id_cliente);
      const empleado = empleados.find(e => e.id_empleado === ventaAEditar.id_empleado);

      setClienteSeleccionado(cliente || null);
      setEmpleadoSeleccionado(empleado || null);
      setMetodoPago(ventaAEditar.metodo_pago || "efectivo");

      if (ventaAEditar.detalle_ventas?.length > 0) {
        const detallesFormateados = ventaAEditar.detalle_ventas.map(d => ({
          id_producto: d.id_producto,
          nombre_producto: d.productos?.nombre || "Producto",
          precio: d.precio_unitario,
          cantidad: d.cantidad
        }));
        setDetalles(detallesFormateados);
      } else {
        setDetalles([]);
      }
    }
  }, [ventaAEditar, clientes, empleados]);

  // Calcular total
  useEffect(() => {
    const total = detalles.reduce((sum, det) => sum + (det.cantidad * det.precio), 0);
    setTotalGeneral(total);
  }, [detalles]);

  // Búsqueda
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setVentasFiltradas(ventas);
    } else {
      const textoLower = textoBusqueda.toLowerCase();
      const filtradas = ventas.filter(v =>
        `${v.clientes?.nombre || ''} ${v.clientes?.apellido || ''}`.toLowerCase().includes(textoLower) ||
        v.empleados?.nombre_empleado?.toLowerCase().includes(textoLower)
      );
      setVentasFiltradas(filtradas);
    }
  }, [textoBusqueda, ventas]);

  const abrirNuevaVenta = () => {
    resetFormulario();
    setMostrarFormulario(true);
  };

  const abrirEdicion = (venta) => {
    setVentaAEditar(venta);
    setMostrarFormulario(true);
  };

  const resetFormulario = () => {
    setClienteSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setMetodoPago("efectivo");
    setDetalles([]);
    setVentaAEditar(null);
  };

  const agregarDetalle = (producto, cantidad) => {
    if (!producto || !cantidad) return;
    setDetalles(prev => {
      const existe = prev.find(d => d.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(d =>
          d.id_producto === producto.id_producto ? { ...d, cantidad: d.cantidad + cantidad } : d
        );
      }
      return [...prev, {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre,
        precio: producto.precio,
        cantidad
      }];
    });
  };

  const eliminarDetalle = (id_producto) => {
    setDetalles(prev => prev.filter(d => d.id_producto !== id_producto));
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setDetalles(prev => prev.map(d =>
      d.id_producto === id_producto ? { ...d, cantidad: nuevaCantidad } : d
    ));
  };

  const guardarVenta = async () => {
    if (!clienteSeleccionado || !empleadoSeleccionado || detalles.length === 0) {
      setToast({ mostrar: true, mensaje: "Selecciona un cliente, empleado y agrega productos", tipo: "advertencia" });
      return;
    }

    try {
      if (ventaAEditar) {
        // === ACTUALIZAR ===
        await supabase.from("ventas").update({
          id_cliente: clienteSeleccionado.id_cliente,
          id_empleado: empleadoSeleccionado.id_empleado,
          total: totalGeneral,
          metodo_pago: metodoPago
        }).eq("id_venta", ventaAEditar.id_venta);

        await supabase.from("detalles_ventas").delete().eq("id_venta", ventaAEditar.id_venta);

        const detallesInsert = detalles.map(d => ({
          id_venta: ventaAEditar.id_venta,
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio,
          subtotal: d.cantidad * d.precio
        }));

        await supabase.from("detalles_ventas").insert(detallesInsert);

        setToast({ mostrar: true, mensaje: "Venta actualizada exitosamente", tipo: "exito" });
      } else {
        // === NUEVA VENTA ===
        const nicaNow = () => new Date().toLocaleString("sv", { timeZone: "America/Managua" }).replace(" ", "T");

        const { data: ventaData, error: ventaError } = await supabase
          .from("ventas")
          .insert([{
            id_cliente: clienteSeleccionado.id_cliente,
            id_empleado: empleadoSeleccionado.id_empleado,
            fecha_venta: nicaNow(),
            metodo_pago: metodoPago,
            total: totalGeneral
          }])
          .select()
          .single();

        if (ventaError) throw ventaError;

        const detallesInsert = detalles.map(d => ({
          id_venta: ventaData.id_venta,
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio,
          subtotal: d.cantidad * d.precio
        }));

        const { error: detalleError } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (detalleError) throw detalleError;

        setToast({ mostrar: true, mensaje: "Venta registrada exitosamente", tipo: "exito" });
      }

      resetFormulario();
      setMostrarFormulario(false);
      await cargarVentas();

    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al guardar la venta", tipo: "error" });
    }
  };

  const manejarBusqueda = (e) => setTextoBusqueda(e.target.value);

  const handlePrint = (venta) => {
    const nombreMostrar = `${venta.clientes?.nombre || ""} ${venta.clientes?.apellido || ""}`.trim() || "Cliente Genérico";
    const fecha = venta.fecha_venta
      ? new Date(venta.fecha_venta).toLocaleString("es-NI", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      : "-";

    const detalle = venta.detalles_ventas || [];
    const total = Number(venta.total);
    const iva = total * 0.10;
    const subtotal = total - iva;
    const numeroVenta = venta.id_venta || "-";
    const empleado = `${venta.empleados?.nombre_empleado || ""} ${venta.empleados?.apellido_empleado || ""}`.trim() || "-";
    const metodoPago = venta.metodo_pago || "-";

    // Create PDF
    const doc = new jsPDF({
      unit: 'mm',
      format: 'letter'
    });

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCOSA', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Factura de Venta', 105, 28, { align: 'center' });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 33, 195, 33);

    // Invoice info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Factura #: ${numeroVenta}`, 20, 42);
    doc.text(`Fecha: ${fecha}`, 120, 42);
    doc.text(`Cliente: ${nombreMostrar}`, 20, 50);
    doc.text(`Atendido por: ${empleado}`, 120, 50);
    doc.text(`Método de Pago: ${metodoPago}`, 20, 58);

    // Line separator
    doc.line(20, 63, 195, 63);

    // Table
    const tableData = detalle.map(item => [
      item.productos?.nombre || 'Producto',
      item.cantidad,
      `C$${Number(item.precio_unitario).toFixed(2)}`,
      `C$${Number(item.subtotal).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: tableData,
      startY: 70,
      theme: 'striped',
      headStyles: {
        fillColor: '#ad1457',
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      margin: { left: 20, right: 20 }
    });

    // Totals
    const finalY = (doc.lastAutoTable.finalY || 150) + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal: C$${subtotal.toFixed(2)}`, 130, finalY);
    doc.text(`IVA (10%): C$${iva.toFixed(2)}`, 130, finalY + 8);
    doc.setFontSize(14);
    doc.text(`TOTAL: C$${total.toFixed(2)}`, 130, finalY + 18);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('¡Gracias por su compra!', 105, finalY + 35, { align: 'center' });
    doc.text('DISCOSA - Todos los derechos reservados', 105, finalY + 42, { align: 'center' });

    // Save PDF
    doc.save(`factura-venta-${numeroVenta}.pdf`);
  };

  return (
    <div className="animate-fade-in margen-superior-main pb-5">
      <Container>
        <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
          <Container>
            <Row className="align-items-center g-3">
              <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
                <h3 className="fw-bold mb-0">
                  <i className="bi bi-receipt-cutoff me-2"></i> Ventas
                </h3>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className="text-end">
                <Button
                  variant="light"
                  onClick={abrirNuevaVenta}
                  className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  <span className="d-none d-sm-inline">Nueva Venta</span>
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar por cliente o empleado..."
            />
          </Col>
        </Row>

        {cargando ? (
          <Row className="text-center my-5">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando ventas...</p>
          </Row>
        ) : (
          <Row>
            <Col xs={12} className="d-lg-none">
              <TarjetaVenta 
                ventas={ventasPaginadas} 
                abrirEdicion={abrirEdicion} 
                handlePrint={handlePrint}
              />
            </Col>
            <Col lg={12} className="d-none d-lg-block">
              <TablaVentas 
                ventas={ventasPaginadas} 
                abrirEdicion={abrirEdicion} 
                handlePrint={handlePrint}
              />
            </Col>
          </Row>
        )}

      {ventasFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={ventasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <FormularioVenta
        mostrar={mostrarFormulario}
        setMostrar={setMostrarFormulario}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        clienteSeleccionado={clienteSeleccionado}
        setClienteSeleccionado={setClienteSeleccionado}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        detalles={detalles}
        totalGeneral={totalGeneral}
        agregarDetalle={agregarDetalle}
        eliminarDetalle={eliminarDetalle}
        actualizarCantidad={actualizarCantidad}
        guardarVenta={guardarVenta}
        ventaAEditar={ventaAEditar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
      </Container>
    </div>
  );
};

export default Ventas;
