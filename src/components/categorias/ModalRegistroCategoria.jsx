import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCategoria = ({
  mostrarModal,
  setMostrarModal,
  nuevaCategoria,
  manejoCambioInput,
  agregarCategoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async (e) => {
    if (e) e.preventDefault();
    if (deshabilitado) return;
    
    setDeshabilitado(true);
    try {
      await agregarCategoria();
    } catch (err) {
      console.error("Error en handleRegistrar:", err);
    } finally {
      setDeshabilitado(false);
    }
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
      animation={true}
      contentClassName="modal-content-custom"
    >
      <Modal.Header closeButton className="modal-header-custom border-0">
        <Modal.Title className="fw-bold">
          <i className="bi-tag-fill me-2 text-primary"></i> Nueva Categoría
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRegistrar}>
        <Modal.Body className="modal-body-custom pt-0">
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold small text-muted text-uppercase">Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              name="nombre_categoria"
              value={nuevaCategoria.nombre_categoria}
              onChange={manejoCambioInput}
              placeholder="Ej: Electrónica, Ropa..."
              className="bg-light border-0 py-2"
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small text-muted text-uppercase">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_categoria"
              value={nuevaCategoria.descripcion_categoria}
              onChange={manejoCambioInput}
              placeholder="Describe qué productos pertenecen a esta categoría..."
              className="bg-light border-0 py-2"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom border-0 pt-0">
          <Button variant="light" onClick={() => setMostrarModal(false)} disabled={deshabilitado} className="fw-semibold">
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={nuevaCategoria.nombre_categoria.trim() === "" || deshabilitado}
            className="px-4 fw-semibold shadow-sm"
          >
            {deshabilitado ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : "Guardar Categoría"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroCategoria;