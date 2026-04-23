import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Badge, Card, Form, InputGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Categorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // Modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  
  // Categoría seleccionada para editar/eliminar
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === "") {
      setCategoriasFiltradas(categorias);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(termino) ||
          (cat.descripcion_categoria &&
            cat.descripcion_categoria.toLowerCase().includes(termino)) ||
          cat.id_categoria.toString().includes(termino)
      );
      setCategoriasFiltradas(filtradas);
    }
  }, [busqueda, categorias]);

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

  return (
    <div className="animate-fade-in margen-superior-main">
      <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
        <Container>
          <Row className="align-items-center g-3">
            <Col xs={12} md={8}>
              <h2 className="fw-bold mb-0">
                <i className="bi-tag me-2"></i>Gestión de Categorías
              </h2>
              <p className="text-white-50 mb-0 d-none d-md-block">Organiza tus productos clasificándolos adecuadamente.</p>
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              <Button
                variant="light"
                onClick={() => setMostrarModalRegistro(true)}
                className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
              >
                <i className="bi-plus-lg me-2"></i>Nueva Categoría
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
                categorias={categoriasFiltradas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </div>

            {/* Vista de Tarjetas para Móvil/Híbrido */}
            <div className="d-lg-none">
              <Row>
                <Col xs={12} sm={12} md={12} className="d-lg-none">
                  <TarjetaCategoria
                    categorias={categoriasFiltradas}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                  />
                </Col>
              </Row>
            </div>
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