import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import ChatIA from "../ia/ChatIA";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarChatIA, setMostrarChatIA] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tienePermiso, logout, usuario } = useAuth();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    await logout();
    setMostrarMenu(false);
    navigate("/login");
  };

  const estaLogueado = !!usuario;
  const esLogin = location.pathname === "/login";

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top" 
        className="color-navbar py-2"
      >
      <Container>
        <Navbar.Brand 
          onClick={() => navigate("/")} 
          className="d-flex align-items-center cursor-pointer me-4"
          style={{ cursor: 'pointer' }}
        >
          <div className="bg-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
            <i className="bi-box-seam text-white h5 mb-0"></i>
          </div>
          <span className="fw-bold fs-4 tracking-tighter">Discosa</span>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={manejarToggle}
            className="border-0 shadow-none p-0"
          >
            <i className={`bi ${mostrarMenu ? 'bi-x-lg' : 'bi-list'} h3 mb-0 text-primary`}></i>
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1 py-3 py-lg-0">

            {esLogin ? (
              <Nav.Link 
                onClick={() => manejarNavegacion("/login")} 
                className={`nav-link-custom ${location.pathname === '/login' ? 'nav-link-active' : ''}`}
              >
                <i className="bi-person-fill-lock me-2"></i> Iniciar sesión
              </Nav.Link>
            ) : !estaLogueado ? (
              <>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/catalogo")} 
                  className={`nav-link-custom ${location.pathname === '/catalogo' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-layout-text-window-reverse me-2"></i> Catálogo
                </Nav.Link>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/login")} 
                  className={`nav-link-custom ${location.pathname === '/login' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-person-circle me-2"></i> Acceso Admin
                </Nav.Link>
              </>
            ) : (
              <>
                {tienePermiso('ver_inicio') && (
                  <>
                    <Nav.Link 
                      onClick={() => manejarNavegacion("/")} 
                      className={`nav-link-custom ${location.pathname === '/' ? 'nav-link-active' : ''}`}
                    >
                      <i className="bi-house-fill me-2"></i> Inicio
                    </Nav.Link>
                    <Nav.Link 
                      onClick={() => manejarNavegacion("/dashboard")} 
                      className={`nav-link-custom ${location.pathname === '/dashboard' ? 'nav-link-active' : ''}`}
                    >
                      <i className="bi-bar-chart-fill me-2"></i> Dashboard
                    </Nav.Link>
                  </>
                )}
                {tienePermiso('ver_categorias') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/categorias")} 
                    className={`nav-link-custom ${location.pathname === '/categorias' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-grid-fill me-2"></i> Categorías
                  </Nav.Link>
                )}
                {tienePermiso('ver_productos') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/productos")} 
                    className={`nav-link-custom ${location.pathname === '/productos' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-box-seam-fill me-2"></i> Productos
                  </Nav.Link>
                )}
                {tienePermiso('ver_empleados') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/empleados")} 
                    className={`nav-link-custom ${location.pathname === '/empleados' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-people-fill me-2"></i> Empleados
                  </Nav.Link>
                )}
                {tienePermiso('ver_clientes') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/clientes")} 
                    className={`nav-link-custom ${location.pathname === '/clientes' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-person-lines-fill me-2"></i> Clientes
                  </Nav.Link>
                )}
                {tienePermiso('ver_ventas') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/ventas")} 
                    className={`nav-link-custom ${location.pathname === '/ventas' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-receipt-cutoff me-2"></i> Ventas
                  </Nav.Link>
                )}
                {tienePermiso('ver_permisos') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/permisos")} 
                    className={`nav-link-custom ${location.pathname === '/permisos' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-shield-lock-fill me-2"></i> Permisos
                  </Nav.Link>
                )}
                {tienePermiso('ver_catalogo') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/catalogo")} 
                    className={`nav-link-custom ${location.pathname === '/catalogo' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi-layout-text-window-reverse me-2"></i> Catálogo
                  </Nav.Link>
                )}
                {estaLogueado && (
                  <Nav.Link 
                    onClick={() => setMostrarChatIA(true)} 
                    className="nav-link-custom text-primary"
                  >
                    <i className="bi bi-robot me-2"></i> Asistente IA
                  </Nav.Link>
                )}
                <div className="ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">
                  <Button 
                    variant="primary" 
                    onClick={cerrarSesion}
                    className="btn-rounded w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi-box-arrow-right"></i> Salir
                  </Button>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      </Navbar>
      <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />
    </>
  );
};

export default Encabezado;