import React from "react";
import { Table, Button, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="table-responsive">
        <Table hover className="align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3 text-uppercase small fw-bold text-muted">ID</th>
              <th className="px-4 py-3 text-uppercase small fw-bold text-muted">Nombre</th>
              <th className="px-4 py-3 text-uppercase small fw-bold text-muted">Descripción</th>
              <th className="px-4 py-3 text-uppercase small fw-bold text-muted text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td className="px-4 py-3 fw-medium text-muted">{cat.id_categoria}</td>
                <td className="px-4 py-3 fw-bold text-dark">{cat.nombre_categoria}</td>
                <td className="px-4 py-3 text-muted">
                  <span className="d-inline-block text-truncate" style={{ maxWidth: "300px" }}>
                    {cat.descripcion_categoria || "Sin descripción"}
                  </span>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="border-0 bg-warning bg-opacity-10 text-warning"
                      onClick={() => abrirModalEdicion(cat)}
                    >
                      <i className="bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="border-0 bg-danger bg-opacity-10 text-danger"
                      onClick={() => abrirModalEliminacion(cat)}
                    >
                      <i className="bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default TablaCategorias;
