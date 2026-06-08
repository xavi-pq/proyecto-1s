import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Card, Badge, Modal } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalQRProducto from "../components/productos/ModalQRProducto";


const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion_producto: "",
    categoria_id: "",
    precio: "",
    stock: "",
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre: "",
    descripcion_producto: "",
    categoria_id: "",
    precio: "",
    stock: "",
    imagen__url: "",
    archivo: null,
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [productoQR, setProductoQR] = useState(null);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoActualizar = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precio = prod.precio?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    cargarCategorias();
    obtenerProductos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(nombre_categoria)")
        .order("id_producto", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
    } finally {
      setCargando(false);
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre.trim() ||
        !nuevoProducto.categoria_id ||
        !nuevoProducto.precio ||
        !nuevoProducto.stock ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios (nombre, categoría, precio, stock e imagen)",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);
      const urlPublica = urlData.publicUrl;

      // Generar ID manual como en el código original si no es autoincremental
      const { data: maxIdData } = await supabase
        .from("productos")
        .select("id_producto")
        .order("id_producto", { ascending: false })
        .limit(1);

      const siguienteId = maxIdData && maxIdData.length > 0 
        ? parseInt(maxIdData[0].id_producto) + 1 
        : 1;

      const { error } = await supabase.from("productos").insert([
        {
          id_producto: siguienteId,
          nombre: nuevoProducto.nombre,
          descripcion_producto: nuevoProducto.descripcion_producto || null,
          categoria_id: nuevoProducto.categoria_id,
          precio: parseFloat(nuevoProducto.precio),
          imagen__url: urlPublica,
          stock: parseInt(nuevoProducto.stock), 
        },
      ]);

      if (error) throw error;

      setNuevoProducto({
        nombre: "",
        descripcion_producto: "",
        categoria_id: "",
        precio: "",
        stock: "",
        archivo: null,
      });

      setToast({ mostrar: true, mensaje: "Producto registrado correctamente", tipo: "exito" });
      obtenerProductos();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setToast({ mostrar: true, mensaje: "Error al registrar producto", tipo: "error" });
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre.trim() ||
        !productoEditar.categoria_id ||
        !productoEditar.precio ||
        productoEditar.stock === ""
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      let datosActualizados = {
        nombre: productoEditar.nombre,
        descripcion_producto: productoEditar.descripcion_producto || null,
        categoria_id: productoEditar.categoria_id,
        precio: parseFloat(productoEditar.precio),
        stock: parseInt(productoEditar.stock),
        imagen__url: productoEditar.imagen__url,
      };

      if (productoEditar.archivo) {
        const nombreArchivo = `${Date.now()}_${productoEditar.archivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);
        
        datosActualizados.imagen__url = urlData.publicUrl;

        if (productoEditar.imagen__url) {
          const nombreAnterior = productoEditar.imagen__url.split("/").pop().split("?")[0];
          await supabase.storage.from("imagenes_productos").remove([nombreAnterior]).catch(() => {});
        }
      }

      const { error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id_producto", productoEditar.id_producto);

      if (error) throw error;

      await obtenerProductos();

      setProductoEditar({
        id_producto: "",
        nombre: "",
        descripcion_producto: "",
        categoria_id: "",
        precio: "",
        stock: "",
        imagen__url: "",
        archivo: null,
      });

      setToast({ mostrar: true, mensaje: "Producto actualizado correctamente", tipo: "exito" });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({ mostrar: true, mensaje: "Error al actualizar producto", tipo: "error" });
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
    setProductoEditar({
      id_producto: prod.id_producto,
      nombre: prod.nombre,
      descripcion_producto: prod.descripcion_producto,
      categoria_id: prod.categoria_id,
      precio: prod.precio,
      stock: prod.stock,
      imagen__url: prod.imagen__url,
      archivo: null,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (prod) => {
    setProductoAEliminar(prod);
    setMostrarModalEliminacion(true);
  };

  const verDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarDetalles(true);
  };

  const copiarProducto = async (producto) => {
    if (!producto) return;
    const nombreMostrar = producto.nombre || producto.nombre_producto || "Producto";
    const texto = `ID: ${producto.id_producto}\nProducto: ${nombreMostrar}\nDescripción: ${producto.descripcion_producto || 'Sin descripción'}\nPrecio: C$ ${Number(producto.precio).toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Producto "${nombreMostrar}" copiado al portapapeles.`,
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

  const generarQRImagen = (producto) => {
    const url = producto?.imagen__url || producto?.url_imagen;
    if (!url) {
      setToast({
        mostrar: true,
        mensaje: "Este producto no tiene imagen asociada",
        tipo: "advertencia"
      });
      return;
    }
    setProductoQR(producto);
    setMostrarModalQR(true);
  };

  return (
    <div className="animate-fade-in pb-5 margen-superior-main">
      <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
        <Container>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <h2 className="fw-bold mb-0">
                <i className="bi-bag-heart-fill me-2"></i>Gestión de Productos
              </h2>
              <p className="text-white-50 mb-0 d-none d-md-block">Administra el inventario de tu negocio de forma eficiente.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button
                variant="light"
                onClick={() => setMostrarModal(true)}
                className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
              >
                <i className="bi-plus-lg me-2"></i>Nuevo Producto
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar por nombre, descripción o precio..."
            />
          </Col>
        </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <Alert variant="info" className="text-center">
          No se encontraron productos.
        </Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4 mb-5">
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

                <Card.Body className="p-3">
                  <div className="text-primary small fw-bold text-uppercase mb-1">
                    {prod.categorias?.nombre_categoria || "General"}
                  </div>
                  <h6 className="fw-bold text-dark text-truncate mb-2">{prod.nombre}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 fw-bold text-primary mb-0">${prod.precio?.toFixed(2) || "0.00"}</span>
                    <Badge bg={(prod.stock || 0) > 5 ? "success" : "danger"} pill>
                      {prod.stock || 0} uds
                    </Badge>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 p-3 pt-0">
                  <div className="d-flex gap-2 mb-2">
                    <Button variant="outline-warning" size="sm" className="w-100 rounded-pill" onClick={() => abrirModalEdicion(prod)}>
                      <i className="bi-pencil me-1"></i>Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" className="w-100 rounded-pill" onClick={() => abrirModalEliminacion(prod)}>
                      <i className="bi-trash me-1"></i>Eliminar
                    </Button>
                  </div>
                  <div className="d-flex gap-2 mb-2">
                    <Button variant="outline-success" size="sm" className="w-100 rounded-pill" onClick={() => copiarProducto(prod)} title="Copiar al portapapeles">
                      <i className="bi bi-clipboard me-1"></i>Copiar
                    </Button>
                    <Button variant="outline-info" size="sm" className="w-100 rounded-pill" onClick={() => generarQRImagen(prod)} title="Generar QR de la imagen">
                      <i className="bi bi-qr-code me-1"></i>Ver QR
                    </Button>
                  </div>
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
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoActualizar={manejoCambioArchivoActualizar}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
        mostrar={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        producto={productoAEliminar}
        onConfirmar={eliminarProducto}
      />

      <ModalQRProducto
        mostrar={mostrarModalQR}
        onHide={() => setMostrarModalQR(false)}
        producto={productoQR}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
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
    </Container>
    </div>
  );
};

export default Productos;
