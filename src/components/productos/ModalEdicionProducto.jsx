import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  onHide,
  producto,
  categorias,
  onGuardar,
}) => {
  const [datos, setDatos] = useState({
    nombre: "",
    descripcion_producto: "",
    precio: "",
    stock: "",
    categoria_id: "",
    imagen__url: "",
  });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (producto) {
      setDatos({
        nombre: producto.nombre || "",
        descripcion_producto: producto.descripcion_producto || "",
        precio: producto.precio || "",
        stock: producto.stock || "",
        categoria_id: producto.categoria_id || "",
        imagen__url: producto.imagen__url || "",
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    await onGuardar(producto.id_producto, {
      ...datos,
      precio: parseFloat(datos.precio),
      stock: parseInt(datos.stock),
    });
    setCargando(false);
  };

  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi-pencil-square text-warning me-2"></i>
          Editar Producto
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pt-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="descripcion_producto"
                  value={datos.descripcion_producto}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">Precio</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="precio"
                  value={datos.precio}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={datos.stock}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">Categoría</Form.Label>
                <Form.Select
                  name="categoria_id"
                  value={datos.categoria_id}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase">URL de la Imagen</Form.Label>
                <Form.Control
                  type="text"
                  name="imagen__url"
                  value={datos.imagen__url}
                  onChange={handleChange}
                  className="bg-light border-0 py-2"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide} disabled={cargando} className="fw-semibold">
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={cargando} className="text-white fw-semibold px-4">
            {cargando ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
            ) : "Actualizar Producto"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionProducto;