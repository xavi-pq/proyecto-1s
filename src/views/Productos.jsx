import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge, Modal } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Productos = () => {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState(location.state?.categoriaId || null);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  
  // Modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion_producto: "",
    precio: "",
    stock: "",
    categoria_id: "",
    imagen__url: "",
  });

  useEffect(() => {
    inicializarVista();
  }, []);

  useEffect(() => {
    if (filtroCategoria) {
      setProductosFiltrados(productos.filter(p => p.categoria_id === filtroCategoria));
    } else {
      setProductosFiltrados(productos);
    }
  }, [filtroCategoria, productos]);

  const inicializarVista = async () => {
    setCargando(true);
    await Promise.all([obtenerProductos(), obtenerCategorias()]);
    setCargando(false);
  };

  const obtenerProductos = async () => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(nombre_categoria)")
        .order("id_producto", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
      setError("No se pudieron cargar los productos.");
    }
  };

  const obtenerCategorias = async () => {
    try {
      const { data, error } = await supabase.from("categorias").select("*");
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al obtener categorías:", err.message);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    try {
      // 1. Obtener el ID más alto actual para productos
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("productos")
        .select("id_producto")
        .order("id_producto", { ascending: false })
        .limit(1);

      if (maxIdError) throw maxIdError;

      const siguienteId = maxIdData && maxIdData.length > 0 
        ? parseInt(maxIdData[0].id_producto) + 1 
        : 1;

      console.log("Generando ID manual para producto:", siguienteId);

      // 2. Insertar con el ID generado manualmente
      const { error } = await supabase.from("productos").insert([
        {
          id_producto: siguienteId,
          nombre: nuevoProducto.nombre,
          descripcion_producto: nuevoProducto.descripcion_producto,
          precio: parseFloat(nuevoProducto.precio),
          stock: parseInt(nuevoProducto.stock),
          categoria_id: nuevoProducto.categoria_id,
          imagen__url: nuevoProducto.imagen__url,
        },
      ]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Producto "${nuevoProducto.nombre}" registrado correctamente.`,
        tipo: "exito",
      });

      setNuevoProducto({
        nombre: "",
        descripcion_producto: "",
        precio: "",
        stock: "",
        categoria_id: "",
        imagen__url: "",
      });

      setMostrarModalRegistro(false);
      obtenerProductos();
    } catch (err) {
      console.error("Error al agregar:", err.message);
      setToast({ mostrar: true, mensaje: `Error: ${err.message}`, tipo: "error" });
    }
  };

  const editarProducto = async (id, datos) => {
    try {
      const { error } = await supabase
        .from("productos")
        .update(datos)
        .eq("id_producto", id);

      if (error) throw error;

      setMostrarModalEdicion(false);
      setToast({ mostrar: true, mensaje: "Producto actualizado correctamente.", tipo: "exito" });
      obtenerProductos();
    } catch (err) {
      console.error("Error al editar:", err.message);
      setToast({ mostrar: true, mensaje: "Error al actualizar producto.", tipo: "error" });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", id);

      if (error) throw error;

      setMostrarModalEliminacion(false);
      setToast({ mostrar: true, mensaje: "Producto eliminado exitosamente.", tipo: "exito" });
      obtenerProductos();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      setToast({ mostrar: true, mensaje: "Error al eliminar producto.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (prod) => {
    setProductoSeleccionado(prod);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (prod) => {
    setProductoSeleccionado(prod);
    setMostrarModalEliminacion(true);
  };

  const verDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarDetalles(true);
  };

  return (
    <div className="animate-fade-in pb-5 margen-superior-main">
      <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
        <Container>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <h2 className="fw-bold mb-0">
                <i className="bi-box-seam me-2"></i>Gestión de Productos
              </h2>
              <p className="text-white-50 mb-0 d-none d-md-block">Administra el inventario de tu negocio.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button
                variant="light"
                onClick={() => setMostrarModalRegistro(true)}
                className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
              >
                <i className="bi-plus-lg me-2"></i>Nuevo Producto
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {filtroCategoria && (
          <Alert variant="info" className="d-flex justify-content-between align-items-center rounded-4 mb-4 border-0 shadow-sm bg-primary bg-opacity-10 text-primary">
            <span>
              <i className="bi-funnel-fill me-2"></i>
              Filtrado por: <strong>{categorias.find(c => c.id_categoria === filtroCategoria)?.nombre_categoria}</strong>
            </span>
            <Button variant="primary" size="sm" className="rounded-pill px-3" onClick={() => setFiltroCategoria(null)}>
              Ver todos
            </Button>
          </Alert>
        )}

        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Sincronizando inventario...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center rounded-4 shadow-sm">
            <i className="bi-exclamation-triangle-fill me-2"></i> {error}
          </Alert>
        ) : productosFiltrados.length === 0 ? (
          <Card className="text-center border-0 bg-light py-5 shadow-sm rounded-4">
            <Card.Body>
              <i className="bi-box text-muted display-1 mb-3"></i>
              <h4 className="text-muted fw-bold">No hay productos</h4>
              <p className="text-muted mb-4">Comienza agregando productos para gestionar tu catálogo.</p>
              <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
                Agregar producto
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {productosFiltrados.map((prod) => (
              <Col key={prod.id_producto}>
                <Card className="h-100 border-0 shadow-sm hover-lift rounded-4 overflow-hidden position-relative">
                  <div style={{ height: "180px" }}>
                    <Card.Img
                      variant="top"
                      src={prod.imagen__url || "https://placehold.co/600x400?text=Sin+Imagen"}
                      className="h-100 w-100 object-fit-cover"
                    />
                  </div>
                  
                  {/* Botones de acción flotantes */}
                  <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2">
                    <Button 
                      variant="white" 
                      size="sm" 
                      className="rounded-circle shadow-sm border-0 p-2 bg-white text-warning"
                      onClick={() => abrirModalEdicion(prod)}
                    >
                      <i className="bi-pencil-fill"></i>
                    </Button>
                    <Button 
                      variant="white" 
                      size="sm" 
                      className="rounded-circle shadow-sm border-0 p-2 bg-white text-danger"
                      onClick={() => abrirModalEliminacion(prod)}
                    >
                      <i className="bi-trash-fill"></i>
                    </Button>
                  </div>

                  <Card.Body className="p-3">
                    <div className="text-primary small fw-bold text-uppercase mb-1">
                      {prod.categorias?.nombre_categoria || "General"}
                    </div>
                    <h6 className="fw-bold text-dark text-truncate mb-2">{prod.nombre}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 fw-bold text-primary mb-0">${prod.precio.toFixed(2)}</span>
                      <Badge bg={prod.stock > 5 ? "success" : "danger"} pill>
                        {prod.stock} uds
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 p-3 pt-0">
                    <Button variant="outline-primary" size="sm" className="w-100 rounded-pill" onClick={() => verDetalles(prod)}>
                      Ver detalles
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <ModalRegistroProducto
          mostrarModal={mostrarModalRegistro}
          setMostrarModal={setMostrarModalRegistro}
          categorias={categorias}
          nuevoProducto={nuevoProducto}
          manejoCambioInput={manejoCambioInput}
          agregarProducto={agregarProducto}
        />

        <ModalEdicionProducto
          mostrar={mostrarModalEdicion}
          onHide={() => setMostrarModalEdicion(false)}
          producto={productoSeleccionado}
          categorias={categorias}
          onGuardar={editarProducto}
        />

        <ModalEliminacionProducto
          mostrar={mostrarModalEliminacion}
          onHide={() => setMostrarModalEliminacion(false)}
          producto={productoSeleccionado}
          onConfirmar={eliminarProducto}
        />

        {/* Modal de Detalles */}
        <Modal show={mostrarDetalles} onHide={() => setMostrarDetalles(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold">Detalles del Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center pb-4">
            {productoSeleccionado && (
              <>
                <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ height: '200px' }}>
                  <img 
                    src={productoSeleccionado.imagen__url || "https://placehold.co/600x400?text=Sin+Imagen"} 
                    className="h-100 w-100 object-fit-cover"
                    alt=""
                  />
                </div>
                <h4 className="fw-bold text-dark mb-1">{productoSeleccionado.nombre}</h4>
                <p className="text-primary fw-bold mb-3">{productoSeleccionado.categorias?.nombre_categoria || "General"}</p>
                
                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <div className="p-2 bg-light rounded-3">
                      <div className="small text-muted mb-1">Precio</div>
                      <div className="fw-bold text-dark">${productoSeleccionado.precio.toFixed(2)}</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-2 bg-light rounded-3">
                      <div className="small text-muted mb-1">Stock</div>
                      <div className="fw-bold text-dark">{productoSeleccionado.stock} unidades</div>
                    </div>
                  </Col>
                </Row>
                
                <div className="text-start">
                  <div className="small text-muted fw-bold text-uppercase mb-2">Descripción</div>
                  <div className="p-3 bg-light rounded-3 small text-muted">
                    {productoSeleccionado.descripcion_producto || "Sin descripción disponible."}
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="primary" className="w-100 rounded-pill" onClick={() => setMostrarDetalles(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

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

export default Productos;