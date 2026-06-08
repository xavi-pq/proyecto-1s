import React from 'react';
import { Pagination, Form } from 'react-bootstrap';

const Paginacion = ({
  registrosPorPagina,
  totalRegistros,
  paginaActual,
  establecerPaginaActual,
  establecerRegistrosPorPagina
}) => {
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));

  let items = [];
  for (let numero = 1; numero <= totalPaginas; numero++) {
    items.push(
      <Pagination.Item
        key={numero}
        active={numero === paginaActual}
        onClick={() => establecerPaginaActual(numero)}
      >
        {numero}
      </Pagination.Item>
    );
  }

  return (
    <div className="position-relative d-flex align-items-center justify-content-center mt-4 mb-5">
      {/* Selector de registros por página */}
      <div className="position-absolute start-0">
        <Form.Select
          size="sm"
          className="rounded-3 border-light shadow-sm px-2"
          style={{ width: '65px', fontSize: '0.85rem' }}
          value={registrosPorPagina}
          onChange={(e) => {
            establecerRegistrosPorPagina(Number(e.target.value));
            establecerPaginaActual(1);
          }}
        >
          <option value="5">5</option>
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Form.Select>
      </div>

      {/* Controles de paginación */}
      <Pagination className="mb-0 shadow-sm rounded-3 overflow-hidden">
        <Pagination.Prev
          disabled={paginaActual === 1}
          onClick={() => establecerPaginaActual(paginaActual - 1)}
        />
        {items}
        <Pagination.Next
          disabled={paginaActual === totalPaginas}
          onClick={() => establecerPaginaActual(paginaActual + 1)}
        />
      </Pagination>
    </div>
  );
};

export default Paginacion;
