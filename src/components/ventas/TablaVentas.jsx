import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaVentas = ({ ventas, abrirEdicion, handlePrint }) => {
  return (
    <Table striped hover responsive size="sm" className="align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Empleado</th>
          <th>Estado</th>
          <th className="text-end">Total</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta.id_venta}>
            <td>#{venta.id_venta}</td>
            <td>{venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleString('es-NI') : '-'}</td>
            <td>{venta.clientes?.nombre} {venta.clientes?.apellido}</td>
            <td>
              {venta.empleados?.nombre_empleado} {venta.empleados?.apellido_empleado}
            </td>
            <td>
              <span className={`badge ${venta.estado ? 'bg-success' : 'bg-danger'}`}>
                {venta.estado ? 'Activo' : 'Anulado'}
              </span>
            </td>
            <td className="text-end fw-bold">C$ {parseFloat(venta.total || 0).toFixed(2)}</td>
            <td className="text-center">
              <div className="d-flex justify-content-center gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handlePrint(venta)}
                  title="Imprimir ticket"
                >
                  <i className="bi bi-printer"></i>
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => abrirEdicion(venta)}
                  title="Editar venta"
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaVentas;
