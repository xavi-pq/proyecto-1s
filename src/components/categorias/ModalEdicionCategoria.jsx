import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategoria = ({
  mostrar,
  onHide,
  categoria,
  onGuardar,
}) => {
  const [datos, setDatos] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (categoria) {
      setDatos({
        nombre_categoria: categoria.nombre_categoria || "",
        descripcion_categoria: categoria.descripcion_categoria || "",
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datos.nombre_categoria.trim()) return;
    
    setCargando(true);
    await onGuardar(categoria.id_categoria, datos);
    setCargando(false);
  };

  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi-pencil-square text-warning me-2"></i>
          Editar Categoría
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pt-4">
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold small text-muted text-uppercase">Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              name="nombre_categoria"
              value={datos.nombre_categoria}
              onChange={handleChange}
              placeholder="Ej: Electrónica"
              className="bg-light border-0 py-2"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small text-muted text-uppercase">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_categoria"
              value={datos.descripcion_categoria}
              onChange={handleChange}
              placeholder="Breve descripción de la categoría..."
              className="bg-light border-0 py-2"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide} disabled={cargando} className="fw-semibold">
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={cargando || !datos.nombre_categoria.trim()} className="text-white fw-semibold px-4">
            {cargando ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
            ) : "Actualizar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionCategoria;