import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrar,
  onHide,
  cliente,
  onConfirmar,
}) => {
  const [cargando, setCargando] = useState(false);

  const handleEliminar = async () => {
    if (!cliente) return;
    setCargando(true);
    await onConfirmar(cliente.id_cliente);
    setCargando(false);
  };

  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static" size="sm">
      <Modal.Body className="text-center p-4">
        <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: "80px", height: "80px" }}>
          <i className="bi-trash-fill display-5"></i>
        </div>
        <h4 className="fw-bold text-dark mb-2">¿Eliminar cliente?</h4>
        <p className="text-muted small mb-4">
          Estás a punto de eliminar a <strong>"{cliente?.nombre} {cliente?.apellido}"</strong>. Esta acción no se puede deshacer.
        </p>
        <div className="d-flex flex-column gap-2">
          <Button variant="danger" className="fw-semibold py-2" onClick={handleEliminar} disabled={cargando}>
            {cargando ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Eliminando...</>
            ) : "Sí, eliminar cliente"}
          </Button>
          <Button variant="light" className="fw-semibold py-2 text-muted" onClick={onHide} disabled={cargando}>
            No, cancelar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEliminacionCliente;
