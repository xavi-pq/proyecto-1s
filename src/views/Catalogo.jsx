import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [productos, categoriaSeleccionada, textoBusqueda]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const [productosRes, categoriasRes] = await Promise.all([
        supabase
          .from("productos")
          .select("*")
          .order("nombre", { ascending: true }),
        supabase
          .from("categorias")
          .select("id_categoria, nombre_categoria")
          .order("nombre_categoria", { ascending: true }),
      ]);

      if (productosRes.error) throw productosRes.error;
      if (categoriasRes.error) throw categoriasRes.error;

      setProductos(productosRes.data || []);
      setCategorias(categoriasRes.data || []);
    } catch (err) {
      console.error("Error al cargar el catálogo:", err);
      setError("No se pudieron cargar los productos. Intenta más tarde.");
    } finally {
      setCargando(false);
    }
  };

  const filtrarProductos = () => {
    let filtrados = productos;

    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (prod) => prod.categoria_id === parseInt(categoriaSeleccionada)
      );
    }

    if (textoBusqueda) {
      const textoLower = textoBusqueda.toLowerCase().trim();
      filtrados = filtrados.filter((prod) => {
        const nombre = prod.nombre?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precio = prod.precio?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
    }

    setProductosFiltrados(filtrados);
  };

  const manejarCambioCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const obtenerNombreCategoria = (idCategoria) => {
    if (idCategoria == null) return "Sin categoría";
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  return (
    <div className="animate-fade-in margen-superior-main">
      <Container className="mt-3 px-1">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-4">
            <i className="bi bi-box-seam me-2"></i>Nuestros productos
          </h2>
        </div>

        <div className="mb-1 align-items-end">
          <Row className="g-4">
            <Col md={4} lg={3} className="me-auto">
              <Form.Group controlId="filtro-categoria">
                <Form.Select
                  className="shadow-sm"
                  value={categoriaSeleccionada}
                  onChange={manejarCambioCategoria}
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} lg={5}>
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
                placeholder="Buscar productos..."
              />
            </Col>
          </Row>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted fw-semibold">Cargando productos...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            {error}
          </Alert>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron productos que coincidan con tu búsqueda.
          </Alert>
        )}

        {!cargando && productosFiltrados.length > 0 && (
          <Row className="g-4 mt-4">
            {productosFiltrados.map((producto) => (
              <Col xs={12} sm={6} md={4} lg={3} key={producto.id_producto}>
                <TarjetaCatalogo
                  producto={producto}
                  categoriaNombre={obtenerNombreCategoria(producto.categoria_id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Catalogo;
