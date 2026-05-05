import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const descripcion = producto.descripcion_producto || "";
  const visualizacionTexto = descripcion.length > 50 
    ? descripcion.substring(0, 50) + "..." 
    : descripcion;
  const tieneMasTexto = descripcion.length > 50;

  return (
    <>
      <Card
        className="h-100 border-0 shadow-lg overflow-hidden position-relative cursor-pointer"
        style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
        role="button"
        tabIndex={0}
        onClick={() => setMostrarModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setMostrarModal(true)}
        aria-labelledby={`producto-${producto.id_producto}-title`}
      >
        <Card.Img
          variant="top"
          src={producto.imagen__url || "https://placehold.co/600x400?text=Sin+Imagen"}
          className="object-fit-cover"
          style={{ height: "250px" }}
        />

        <Card.Body className="d-flex flex-column p-3">
          <Card.Title
            id={`producto-${producto.id_producto}-title`}
            className="h6 fw-bold text-dark mb-2"
          >
            {producto.nombre}
          </Card.Title>

          <Card.Text className="flex-grow-1 text-muted small fw-medium mb-1">
            {visualizacionTexto}
          </Card.Text>

          {tieneMasTexto && (
            <span className="text-primary medium ms-1">
              <i className="bi-eye"></i> Ver más
            </span>
          )}

          <div className="mt-2">
            <Badge bg="primary" pill className="ms-1">
              {categoriaNombre || "Sin categoría"}
            </Badge>
          </div>
        </Card.Body>

        <Card.Footer className="bg-white pt-0 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-success fs-4">
              ${parseFloat(producto.precio).toFixed(2)}
            </span>
          </div>
        </Card.Footer>
      </Card>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-4 fw-bold">
            {producto.nombre}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
          <div className="row g-4">
            <div className="col-md-6">
              <img
                src={producto.imagen__url || "https://placehold.co/600x400?text=Sin+Imagen"}
                alt={producto.nombre}
                className="img-fluid rounded shadow-sm object-fit-cover"
                style={{ height: "400px", width: "100%" }}
              />
            </div>

            <div className="col-md-6 d-flex flex-column">
              <div className="mb-3">
                <Badge bg="primary" pill className="mb-2">
                  {categoriaNombre || "Sin categoría"}
                </Badge>
              </div>

              <h3 className="fw-bold text-dark mb-3">
                ${parseFloat(producto.precio).toFixed(2)}
              </h3>

              {descripcion && (
                <div className="mb-2">
                  <h6 className="fw-bold text-muted mb-1">Descripción:</h6>
                  <p className="text-muted" style={{ lineHeight: "1.7" }}>
                    {descripcion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;
