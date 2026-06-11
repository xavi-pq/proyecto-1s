import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);   // ← Estado de carga inicial
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_empleado: "",
    apellido_empleado: "",
    celular: "",
    pin: "",
    email: "",
    password: "",
    tipo_empleado: "",
  });

  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_empleado: "",
    nombre_empleado: "",
    apellido_empleado: "",
    celular: "",
    pin: "",
    email: "",
    tipo_empleado: "",
  });

  // Cargar empleados
  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al cargar empleados", tipo: "error" });
        return;
      }
      setEmpleados(data || []);
      setEmpleadosFiltrados(data || []);
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar empleados", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Filtrado
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const texto = textoBusqueda.toLowerCase().trim();
      const filtrados = empleados.filter(emp =>
        `${emp.nombre_empleado} ${emp.apellido_empleado} ${emp.email || ""} ${emp.tipo_empleado || ""}`
          .toLowerCase().includes(texto)
      );
      setEmpleadosFiltrados(filtrados);
    }
  }, [textoBusqueda, empleados]);

  const agregarEmpleado = async () => {
    if (!nuevoEmpleado.nombre_empleado || !nuevoEmpleado.apellido_empleado ||
        !nuevoEmpleado.email || !nuevoEmpleado.password || !nuevoEmpleado.tipo_empleado) {
      setToast({ mostrar: true, mensaje: "Los campos Nombre, Apellido, Email, Contraseña y Rol son obligatorios", tipo: "advertencia" });
      return;
    }

    try {
      setMostrarModal(false);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: nuevoEmpleado.email,
        password: nuevoEmpleado.password,
        options: {
          data: {
            nombre: nuevoEmpleado.nombre_empleado,
            apellido: nuevoEmpleado.apellido_empleado,
          }
        }
      });

      if (authError) throw authError;

      const { error: dbError } = await supabase.from("empleados").insert([{
        nombre_empleado: nuevoEmpleado.nombre_empleado,
        apellido_empleado: nuevoEmpleado.apellido_empleado,
        celular: nuevoEmpleado.celular,
        pin: nuevoEmpleado.pin,
        email: nuevoEmpleado.email,
        tipo_empleado: nuevoEmpleado.tipo_empleado,
      }]);

      if (dbError) throw dbError;

      await cargarEmpleados();
      setNuevoEmpleado({ nombre_empleado: "", apellido_empleado: "", celular: "", pin: "", email: "", password: "", tipo_empleado: "" });

      setToast({
        mostrar: true,
        mensaje: `Empleado ${nuevoEmpleado.nombre_empleado} registrado correctamente`,
        tipo: "exito"
      });
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: err.message || "Error al registrar empleado", tipo: "error" });
    }
  };

  const actualizarEmpleado = async () => {
    if (!empleadoEditar.nombre_empleado || !empleadoEditar.apellido_empleado ||
        !empleadoEditar.tipo_empleado) {
      setToast({ mostrar: true, mensaje: "Nombre, Apellido y Rol son obligatorios", tipo: "advertencia" });
      return;
    }

    try {
      setMostrarModalEdicion(false);
      const { error } = await supabase
        .from("empleados")
        .update({
          nombre_empleado: empleadoEditar.nombre_empleado,
          apellido_empleado: empleadoEditar.apellido_empleado,
          celular: empleadoEditar.celular,
          pin: empleadoEditar.pin,
          tipo_empleado: empleadoEditar.tipo_empleado,
        })
        .eq("id_empleado", empleadoEditar.id_empleado);

      if (error) throw error;

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoEditar.nombre_empleado} actualizado`,
        tipo: "exito"
      });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al actualizar empleado", tipo: "error" });
    }
  };

  const eliminarEmpleado = async (id_empleado, nombre_empleado) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al empleado ${nombre_empleado}?`)) {
      try {
        const { error } = await supabase
          .from("empleados")
          .delete()
          .eq("id_empleado", id_empleado);

        if (error) throw error;

        await cargarEmpleados();
        setToast({
          mostrar: true,
          mensaje: `Empleado ${nombre_empleado} eliminado correctamente`,
          tipo: "exito"
        });
      } catch (err) {
        setToast({ mostrar: true, mensaje: "Error al eliminar empleado", tipo: "error" });
      }
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar({
      id_empleado: empleado.id_empleado,
      nombre_empleado: empleado.nombre_empleado,
      apellido_empleado: empleado.apellido_empleado,
      celular: empleado.celular || "",
      pin: empleado.pin || "",
      email: empleado.email || "",
      tipo_empleado: empleado.tipo_empleado,
    });
    setMostrarModalEdicion(true);
  };

  return (
    <div className="animate-fade-in margen-superior-main pb-5">
      <Container>
        <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
          <Container>
            <Row className="align-items-center g-3">
              <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
                <h3 className="fw-bold mb-0">
                  <i className="bi-person-badge-fill me-2"></i>Empleados
                </h3>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} className="text-end">
                <Button
                  variant="light"
                  onClick={() => setMostrarModal(true)}
                  className="fw-bold text-primary px-4 py-2 w-100 w-md-auto shadow-sm btn-rounded"
                >
                  <i className="bi-plus-lg me-2"></i>Nuevo Empleado
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

      <Row className="mb-4">
        <Col md={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {/* Spinner de carga inicial */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando empleados...</p>
          </Col>
        </Row>
      )}

      {/* Alert cuando no hay coincidencias en la búsqueda */}
      {!cargando && textoBusqueda.trim() && empleadosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron empleados que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Mostrar tabla o tarjetas solo cuando hay resultados y ya cargó */}
      {!cargando && empleadosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaEmpleado
              empleados={empleadosFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              eliminarEmpleado={eliminarEmpleado}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaEmpleados
              empleados={empleadosFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              eliminarEmpleado={eliminarEmpleado}
            />
          </Col>
        </Row>
      )}

      {/* Modales */}
      <ModalRegistroEmpleado
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        setNuevoEmpleado={setNuevoEmpleado}
        agregarEmpleado={agregarEmpleado}
      />

      <ModalEdicionEmpleado
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        empleadoEditar={empleadoEditar}
        setEmpleadoEditar={setEmpleadoEditar}
        actualizarEmpleado={actualizarEmpleado}
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

export default Empleados;
