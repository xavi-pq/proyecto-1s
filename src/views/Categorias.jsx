import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Badge, Card, Form, InputGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import Paginacion from "../components/Paginacion";
import emailjs from '@emailjs/browser';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Categorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);

  // Modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  
  // Correo
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  
  // Categoría seleccionada para editar/eliminar
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    let filtradas = categorias;
    if (busqueda.trim() !== "") {
      const termino = busqueda.toLowerCase();
      filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(termino) ||
          (cat.descripcion_categoria &&
            cat.descripcion_categoria.toLowerCase().includes(termino)) ||
          cat.id_categoria.toString().includes(termino)
      );
    }
    setCategoriasFiltradas(filtradas);
    setPaginaActual(1); // Resetear a la primera página al buscar
  }, [busqueda, categorias]);

  // Obtener categorías para la página actual
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const categoriasPaginadas = categoriasFiltradas.slice(indicePrimerItem, indiceUltimoItem);

  const obtenerCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: false });

      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al obtener categorías:", err.message);
      setError("No se pudieron cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre_categoria.trim()) {
        setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
        return;
      }

      // 1. Obtener el ID más alto actual (ya que no es autoincremental en tu BD)
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("categorias")
        .select("id_categoria")
        .order("id_categoria", { ascending: false })
        .limit(1);

      if (maxIdError) throw maxIdError;

      const siguienteId = maxIdData && maxIdData.length > 0 
        ? parseInt(maxIdData[0].id_categoria) + 1 
        : 1;

      console.log("Generando ID manual:", siguienteId);

      // 2. Insertar con el ID generado manualmente
      const { error } = await supabase.from("categorias").insert([
        {
          id_categoria: siguienteId,
          nombre_categoria: nuevaCategoria.nombre_categoria,
          descripcion_categoria: nuevaCategoria.descripcion_categoria,
        },
      ]);

      if (error) throw error;

      setMostrarModalRegistro(false);
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada exitosamente.`,
        tipo: "exito",
      });
      obtenerCategorias();
    } catch (err) {
      console.error("Error al agregar:", err.message);
      setToast({ mostrar: true, mensaje: `Error: ${err.message}`, tipo: "error" });
    }
  };

  const editarCategoria = async (id, datos) => {
    try {
      const { error } = await supabase
        .from("categorias")
        .update(datos)
        .eq("id_categoria", id);

      if (error) throw error;

      setMostrarModalEdicion(false);
      setToast({ mostrar: true, mensaje: "Categoría actualizada correctamente.", tipo: "exito" });
      obtenerCategorias();
    } catch (err) {
      console.error("Error al editar:", err.message);
      setToast({ mostrar: true, mensaje: "Error al actualizar categoría.", tipo: "error" });
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", id);

      if (error) throw error;

      setMostrarModalEliminacion(false);
      setToast({ mostrar: true, mensaje: "Categoría eliminada exitosamente.", tipo: "exito" });
      obtenerCategorias();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      setToast({ mostrar: true, mensaje: "Error al eliminar categoría.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (cat) => {
    setCategoriaSeleccionada(cat);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cat) => {
    setCategoriaSeleccionada(cat);
    setMostrarModalEliminacion(true);
  };

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";

    let texto = `LISTADO DE CATEGORÍAS\n\n`;
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de categorías: ${categorias.length}\n\n`;

    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre_categoria}\n`;
      if (cat.descripcion_categoria) {
        texto += `   Descripción: ${cat.descripcion_categoria}\n`;
      }
      texto += `\n`;
    });

    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }

    setEnviandoCorreo(true);

    const mensaje = formatearCategoriasParaCorreo();

    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )
      .then(() => {
        setToast({
          mostrar: true,
          mensaje: "Correo enviado correctamente.",
          tipo: "exito",
        });
        setMostrarModalCorreo(false);
        setEmailDestino("");
      })
      .catch((error) => {
        console.error("Error EmailJS:", error);
        setToast({
          mostrar: true,
          mensaje: "Error al enviar el correo.",
          tipo: "error",
        });
      })
      .finally(() => {
        setEnviandoCorreo(false);
      });
  };

  const generarPDFCategoria = (categoria) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Categoría", 14, 20);

    // Línea decorativa
    doc.line(14, 25, 195, 25);

    // Información de la categoría
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", categoria.id_categoria],
        ["Nombre", categoria.nombre_categoria],
        ["Descripción", categoria.descripcion_categoria],
      ],
    });

    // Descargar PDF
    doc.save(`categoria_${categoria.id_categoria}.pdf`);
  };

  const copiarCategoria = async (categoria) => {
    if (!categoria) return;
    const nombreMostrar = categoria.nombre_categoria || "Categoría";
    const texto = `ID: ${categoria.id_categoria}\nCategoría: ${nombreMostrar}\nDescripción: ${categoria.descripcion_categoria || 'Sin descripción'}`;
    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Categoría "${nombreMostrar}" copiada al portapapeles.`,
        tipo: 'exito',
      });
    } catch (err) {
      console.error("Error al copiar: ", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar al portapapeles",
        tipo: 'error',
      });
    }
  };

  const copiarCategoria = async (categoria) => {
    if (!categoria) return;
    const texto = `ID: ${categoria.id_categoria}\nCategoría: ${categoria.nombre_categoria}\nDescripción: ${categoria.descripcion_categoria || 'Sin descripción'}`;
    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Categoría "${categoria.nombre_categoria}" copiada al portapapeles.`,
        tipo: 'exito',
      });
    } catch (err) {
      console.error("Error al copiar:", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar al portapapeles",
        tipo: 'error',
      });
    }
  };

  return (
    <div className="animate-fade-in margen-superior-main">
      <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
        <Container>
          <Row className="align-items-center g-3">
            <Col xs={12} sm={8} md={8} lg={8} className="d-flex align-items-center">
              <h3 className="fw-bold mb-0">
                <i className="bi-bookmark-plus-fill me-2"></i> Categorías
              </h3>
            </Col>
            <Col xs={12} sm={2} md={2} lg={2} className="text-end">
              <Button variant="primary" onClick={abrirModalCorreo} size="md">
                <i className="bi bi-envelope"></i>
                <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
              </Button>
            </Col>
            <Col xs={12} sm={2} md={2} lg={2} className="text-end">
              <Button
                onClick={() => setMostrarModalRegistro(true)}
                size="md"
              >
                <i className="bi-plus-lg"></i>
                <span className="d-none d-lg-inline ms-2">Nueva Categoría</span>
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Cuadro de Búsqueda */}
        <div className="mb-4">
          <Row className="justify-content-start">
            <Col md={6} lg={4}>
              <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 bg-white p-1">
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar..."
                  className="border-0 shadow-none bg-transparent"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <Button 
                    variant="link" 
                    className="text-muted pe-3 text-decoration-none"
                    onClick={() => setBusqueda("")}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando categorías...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center rounded-4 shadow-sm">
            <i className="bi-exclamation-triangle-fill me-2"></i> {error}
          </Alert>
        ) : categorias.length === 0 ? (
          <Card className="text-center border-0 bg-light py-5 shadow-sm rounded-4">
            <Card.Body>
              <i className="bi-tag text-muted display-1 mb-3"></i>
              <h4 className="text-muted fw-bold">No hay categorías</h4>
              <p className="text-muted mb-4">Comienza agregando una categoría para organizar tus productos.</p>
              <Button variant="primary" className="btn-rounded" onClick={() => setMostrarModalRegistro(true)}>
                Crear Categoría
              </Button>
            </Card.Body>
          </Card>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="text-center py-5 opacity-50">
            <i className="bi bi-search display-3 mb-3 text-muted"></i>
            <h4 className="text-muted">No se encontraron resultados</h4>
            <p className="text-muted small">Intenta con otros términos de búsqueda.</p>
            <Button variant="link" onClick={() => setBusqueda("")}>Limpiar búsqueda</Button>
          </div>
        ) : (
          <>
            {/* Vista de Tabla para Escritorio */}
            <div className="d-none d-lg-block">
              <TablaCategorias
                categorias={categoriasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                generarPDFCategoria={generarPDFCategoria}
                copiarCategoria={copiarCategoria}
              />
            </div>

            {/* Vista de Tarjetas para Móvil/Híbrido */}
            <div className="d-lg-none">
              <Row>
                <Col xs={12} sm={12} md={12} className="d-lg-none">
                  <TarjetaCategoria
                    categorias={categoriasPaginadas}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                    generarPDFCategoria={generarPDFCategoria}
                    copiarCategoria={copiarCategoria}
                  />
                </Col>
              </Row>
            </div>

            {/* Componente de Paginación */}
            <Paginacion 
              paginaActual={paginaActual}
              totalItems={categoriasFiltradas.length}
              itemsPorPagina={itemsPorPagina}
              onCambioPagina={setPaginaActual}
              onCambioItemsPorPagina={setItemsPorPagina}
            />
          </>
        )}

        <ModalRegistroCategoria
          mostrarModal={mostrarModalRegistro}
          setMostrarModal={setMostrarModalRegistro}
          nuevaCategoria={nuevaCategoria}
          manejoCambioInput={manejoCambioInput}
          agregarCategoria={agregarCategoria}
        />

        <ModalEdicionCategoria
          mostrar={mostrarModalEdicion}
          onHide={() => setMostrarModalEdicion(false)}
          categoria={categoriaSeleccionada}
          onGuardar={editarCategoria}
        />

        <ModalEliminacionCategoria
          mostrar={mostrarModalEliminacion}
          onHide={() => setMostrarModalEliminacion(false)}
          categoria={categoriaSeleccionada}
          onConfirmar={eliminarCategoria}
        />

        <ModalEnvioCorreoCategorias
          mostrarModalCorreo={mostrarModalCorreo}
          setMostrarModalCorreo={setMostrarModalCorreo}
          emailDestino={emailDestino}
          setEmailDestino={setEmailDestino}
          enviandoCorreo={enviandoCorreo}
          enviarCorreoCategorias={enviarCorreoCategorias}
          totalCategorias={categorias.length}
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

export default Categorias;