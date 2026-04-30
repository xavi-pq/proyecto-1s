import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda, placeholder }) => {
  return (
    <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 bg-white p-1">
      <InputGroup.Text className="bg-transparent border-0 ps-3">
        <i className="bi bi-search text-muted"></i>
      </InputGroup.Text>
      <Form.Control
        placeholder={placeholder || "Buscar..."}
        className="border-0 shadow-none bg-transparent"
        value={textoBusqueda}
        onChange={manejarCambioBusqueda}
      />
      {textoBusqueda && (
        <Button 
          variant="link" 
          className="text-muted pe-3 text-decoration-none"
          onClick={() => manejarCambioBusqueda({ target: { value: "" } })}
        >
          <i className="bi bi-x-circle-fill"></i>
        </Button>
      )}
    </InputGroup>
  );
};

export default CuadroBusquedas;
