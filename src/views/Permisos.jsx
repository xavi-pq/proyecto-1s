import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaPermisos from "../components/permisos/TablaPermisos";
import TarjetaPermisos from "../components/permisos/TarjetaPermisos";
import ModalEdicionPermisos from "../components/permisos/ModalEdicionPermisos";

const Permisos = () => {
  const [roles, setRoles] = useState([]);
  const [rolesFiltrados, setRolesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [rolEditar, setRolEditar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const cargarRoles = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("permisos")
        .select("*")
        .order("rol", { ascending: true });

      if (error) throw error;

      // Parse permissions for each role if they're strings
      const parsedRoles = (data || []).map(role => ({
        ...role,
        permisos: typeof role.permisos === 'string' ? JSON.parse(role.permisos) : role.permisos || {}
      }));
      setRoles(parsedRoles);
      setRolesFiltrados(parsedRoles);
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al cargar permisos", tipo: "error" });
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  // Filtrado
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setRolesFiltrados(roles);
    } else {
      const texto = textoBusqueda.toLowerCase();
      const filtrados = roles.filter(r => 
        r.rol.toLowerCase().includes(texto) || 
        (r.descripcion || "").toLowerCase().includes(texto)
      );
      setRolesFiltrados(filtrados);
    }
  }, [textoBusqueda, roles]);

  const abrirModalEdicion = (rol) => {
    setRolEditar({ ...rol });
    setMostrarModalEdicion(true);
  };

  const actualizarPermisos = async () => {
    if (!rolEditar) return;

    try {
      const { error } = await supabase
        .from("permisos")
        .update({ permisos: rolEditar.permisos })
        .eq("id_permiso", rolEditar.id_permiso);

      if (error) throw error;

      await cargarRoles();
      setMostrarModalEdicion(false);
      setToast({
        mostrar: true,
        mensaje: `Permisos de ${rolEditar.rol} actualizados correctamente`,
        tipo: "exito"
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error al actualizar permisos", tipo: "error" });
    }
  };

  return (
    <div className="animate-fade-in margen-superior-main pb-5">
      <Container>
        <div className="bg-primary bg-gradient text-white py-4 mb-4 shadow-sm rounded-4 mx-2 mx-md-3 mt-3">
          <Container>
            <Row className="align-items-center g-3">
              <Col xs={12} className="d-flex align-items-center">
                <h3 className="fw-bold mb-0">
                  <i className="bi bi-shield-lock-fill me-2"></i>Gestión de Permisos
                </h3>
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

      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando permisos...</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaPermisos 
              roles={rolesFiltrados} 
              abrirModalEdicion={abrirModalEdicion} 
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaPermisos 
              roles={rolesFiltrados} 
              abrirModalEdicion={abrirModalEdicion} 
            />
          </Col>
        </Row>
      )}

      <ModalEdicionPermisos
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        rolEditar={rolEditar}
        setRolEditar={setRolEditar}
        guardarCambios={actualizarPermisos}
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

export default Permisos;
