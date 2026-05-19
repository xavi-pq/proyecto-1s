import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    celular: "",
  });

  const [clienteEditar, setClienteEditar] = useState({
    id_cliente: "",
    nombre: "",
    apellido: "",
    celular: "",
  });

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = clientes.filter((cli) => {
        const nombre = cli.nombre?.toLowerCase() || "";
        const apellido = cli.apellido?.toLowerCase() || "";
        const celular = cli.celular?.toLowerCase() || "";
        return (
          nombre.includes(textoLower) ||
          apellido.includes(textoLower) ||
          celular.includes(textoLower)
        );
      });
      setClientesFiltrados(filtrados);
    }
  }, [textoBusqueda, clientes]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: false });

      if (error) throw error;
      setClientes(data || []);
      setClientesFiltrados(data || []);
    } catch (err) {
      console.error("Error al obtener clientes:", err.message);
    } finally {
      setCargando(false);
    }
  };

  const agregarCliente = async () => {
    try {
      if (
        !nuevoCliente.nombre.trim() ||
        !nuevoCliente.apellido.trim() ||
        !nuevoCliente.celular
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa todos los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const { data: maxIdData } = await supabase
        .from("clientes")
        .select("id_cliente")
        .order("id_cliente", { ascending: false })
        .limit(1);

      const siguienteId = maxIdData && maxIdData.length > 0 
        ? parseInt(maxIdData[0].id_cliente) + 1 
        : 1;

      const { error } = await supabase.from("clientes").insert([
        {
          id_cliente: siguienteId,
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          celular: nuevoCliente.celular,
        },
      ]);

      if (error) throw error;

      setNuevoCliente({
        nombre: "",
        apellido: "",
        celular: "",
      });

      setToast({ mostrar: true, mensaje: "Cliente registrado correctamente", tipo: "exito" });
      obtenerClientes();
    } catch (err) {
      console.error("Error al agregar cliente:", err);
      setToast({ mostrar: true, mensaje: "Error al registrar cliente", tipo: "error" });
    }
  };

  const actualizarCliente = async () => {
    try {
      if (
        !clienteEditar.nombre.trim() ||
        !clienteEditar.apellido.trim() ||
        !clienteEditar.celular
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("clientes")
        .update({
          nombre: clienteEditar.nombre,
          apellido: clienteEditar.apellido,
          celular: clienteEditar.celular,
        })
        .eq("id_cliente", clienteEditar.id_cliente);

      if (error) throw error;

      await obtenerClientes();

      setClienteEditar({
        id_cliente: "",
        nombre: "",
        apellido: "",
        celular: "",
      });

      setToast({ mostrar: true, mensaje: "Cliente actualizado correctamente", tipo: "exito" });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({ mostrar: true, mensaje: "Error al actualizar cliente", tipo: "error" });
    }
  };

  const eliminarCliente = async (id) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", id);

      if (error) throw error;

      setMostrarModalEliminacion(false);
      setToast({ mostrar: true, mensaje: "Cliente eliminado exitosamente.", tipo: "exito" });
      obtenerClientes();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      setToast({ mostrar: true, mensaje: "Error al eliminar cliente.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (cli) => {
    setClienteEditar({
      id_cliente: cli.id_cliente,
      nombre: cli.nombre,
      apellido: cli.apellido,
      celular: cli.celular,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cli) => {
    setClienteAEliminar(cli);
    setMostrarModalEliminacion(true);
  };

  const verDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarDetalles(true);
  };

  return (
    <div className="animate-fade-in pb-5 margen-superior-main">
      <div className="bg-info bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
        <Container>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <h2 className="fw-bold mb-0">
                <i className="bi-person-lines-fill me-2"></i>Gestión de Clientes
              </h2>
              <p className="text-white-50 mb-0 d-none d-md-block">Administra la información de tus clientes.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button
                variant="light"
                onClick={() => setMostrarModal(true)}
                className="fw-bold text-info px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
              >
                <i className="bi-plus-lg me-2"></i>Nuevo Cliente
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar por nombre, apellido o celular..."
            />
          </Col>
        </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="info" />
          <p className="mt-3 text-muted">Cargando clientes...</p>
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <Alert variant="info" className="text-center">
          No se encontraron clientes.
        </Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4 mb-5">
          {clientesFiltrados.map((cli) => (
            <Col key={cli.id_cliente}>
              <Card className="h-100 border-0 shadow-sm hover-lift rounded-4 overflow-hidden">
                <div className="bg-info bg-gradient p-4 text-center">
                  <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '80px' }}>
                    <i className="bi-person-fill text-info display-3"></i>
                  </div>
                </div>
                <Card.Body className="p-3 text-center">
                  <h6 className="fw-bold text-dark mb-1">{cli.nombre} {cli.apellido}</h6>
                  <p className="text-muted small mb-0">
                    <i className="bi-telephone-fill me-1"></i> {cli.celular}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 p-3 pt-0">
                  <div className="d-flex gap-2 mb-2">
                    <Button variant="outline-warning" size="sm" className="w-100 rounded-pill" onClick={() => abrirModalEdicion(cli)}>
                      <i className="bi-pencil me-1"></i>Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" className="w-100 rounded-pill" onClick={() => abrirModalEliminacion(cli)}>
                      <i className="bi-trash me-1"></i>Eliminar
                    </Button>
                  </div>
                  <Button variant="outline-info" size="sm" className="w-100 rounded-pill" onClick={() => verDetalles(cli)}>
                    Ver detalles
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <ModalEliminacionCliente
        mostrar={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        cliente={clienteAEliminar}
        onConfirmar={eliminarCliente}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

      <Modal show={mostrarDetalles} onHide={() => setMostrarDetalles(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Detalles del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pb-4">
          {clienteSeleccionado && (
            <>
              <div className="bg-info bg-gradient rounded-4 p-4 mb-4">
                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
                  <i className="bi-person-fill text-info display-2"></i>
                </div>
              </div>
              <h4 className="fw-bold text-dark mb-1">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</h4>
              <p className="text-muted mb-3">
                <i className="bi-telephone-fill me-2"></i> {clienteSeleccionado.celular}
              </p>
              <div className="text-start">
                <Row className="g-3">
                  <Col xs={12}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted fw-bold text-uppercase mb-1">ID</div>
                      <div className="fw-bold text-dark">#{clienteSeleccionado.id_cliente}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="info" className="w-100 rounded-pill" onClick={() => setMostrarDetalles(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default Clientes;
