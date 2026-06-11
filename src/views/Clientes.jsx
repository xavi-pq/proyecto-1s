import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCliente from "../components/clientes/TarjetaCliente";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import TablaClientes from "../components/clientes/TablaClientes";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    celular: "",
  });
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const [clienteEditar, setClienteEditar] = useState({
    id_cliente: "",
    nombre: "",
    apellido: "",
    celular: "",
  });

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = clientes.filter(
        (cli) =>
          cli.nombre?.toLowerCase().includes(textoLower) ||
          cli.apellido?.toLowerCase().includes(textoLower) ||
          cli.celular?.toLowerCase().includes(textoLower)
      );
      setClientesFiltrados(filtrados);
    }
  }, [textoBusqueda, clientes]);

  const abrirModalEdicion = (cliente) => {
    setClienteEditar({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      celular: cliente.celular,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCliente = async () => {
    try {
      if (!nuevoCliente.nombre.trim() || !nuevoCliente.celular.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar nombre y celular.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("clientes").insert([
        {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          celular: nuevoCliente.celular,
        },
      ]);

      if (error) {
        console.error("Error al agregar cliente:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar cliente.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Cliente "${nuevoCliente.nombre} ${nuevoCliente.apellido}" registrado exitosamente.`,
        tipo: "exito",
      });

      setNuevoCliente({ nombre: "", apellido: "", celular: "" });
      setMostrarModal(false);
      await cargarClientes();
    } catch (err) {
      console.error("Excepción al agregar cliente:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar cliente.",
        tipo: "error",
      });
    }
  };

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });

      if (error) {
        console.error("Error al cargar clientes:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar clientes.",
          tipo: "error",
        });
        return;
      }
      setClientes(data || []);
    } catch (err) {
      console.error("Excepción al cargar clientes:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar clientes.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      setMostrarModalEliminacion(false);
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", clienteAEliminar.id_cliente);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el cliente.`,
          tipo: "error",
        });
        return;
      }

      await cargarClientes();
      setToast({
        mostrar: true,
        mensaje: `Cliente eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar cliente.",
        tipo: "error",
      });
    }
  };

  const actualizarCliente = async () => {
    try {
      if (!clienteEditar.nombre.trim() || !clienteEditar.celular.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar nombre y celular.",
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

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al actualizar cliente.",
          tipo: "error",
        });
        return;
      }

      await cargarClientes();
      setToast({
        mostrar: true,
        mensaje: `Cliente actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar cliente.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="animate-fade-in margen-superior-main pb-5">
      <Container>
        {/* Título y botón Nuevo Cliente */}
        <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
          <Container>
            <Row className="align-items-center g-3">
              <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
                <h3 className="fw-bold mb-0">
                  <i className="bi-people-fill me-2"></i> Clientes
                </h3>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className="text-end">
                <Button
                  variant="light"
                  onClick={() => setMostrarModal(true)}
                  className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
                >
                  <i className="bi-plus-lg me-2"></i> Nuevo Cliente
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

      {/* Búsqueda */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, apellido o celular..."
          />
        </Col>
      </Row>

      {/* Mensaje sin resultados */}
      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron clientes que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Cargando */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando clientes...</p>
          </Col>
        </Row>
      )}

      {/* Lista */}
      {!cargando && clientesFiltrados.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaCliente
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaClientes
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {clientesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={clientesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modales */}
      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
      </Container>
    </div>
  );
};

export default Clientes;
