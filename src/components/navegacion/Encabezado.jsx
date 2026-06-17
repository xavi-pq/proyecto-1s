import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Button, Badge } from "react-bootstrap";
import { useAuth } from '../../hooks/useAuth';
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
        className="py-3"
      >
      <Container fluid className="px-3 px-lg-4">
        <Navbar.Brand 
          onClick={() => navigate("/")} 
          className="d-flex align-items-center cursor-pointer me-4"
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="rounded-circle p-2 me-2 d-flex align-items-center justify-content-center shadow"
            style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, #FF69B4, #FF1493)'
            }}
          >
            <i className="bi bi-shop text-white fs-4 mb-0"></i>
          </div>
          <span className="fw-bold fs-4" style={{ color: '#880E4F' }}>
            DISCOSA
          </span>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={manejarToggle}
            className="border-0 shadow-none p-2"
            style={{ borderRadius: '12px' }}
          >
            <i className={`bi ${mostrarMenu ? 'bi-x-lg' : 'bi-list'} fs-2 text-dark`} style={{ color: '#AD1457' }}></i>
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1 py-3 py-lg-0">

            {esLogin ? (
              <Nav.Link 
                onClick={() => manejarNavegacion("/login")} 
                className={`nav-link-custom ${location.pathname === '/login' ? 'nav-link-active' : ''}`}
              >
                <i className="bi bi-person-fill-lock me-2"></i> Iniciar sesión
              </Nav.Link>
            ) : !estaLogueado ? (
              <>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/catalogo")} 
                  className={`nav-link-custom ${location.pathname === '/catalogo' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi bi-layout-text-window-reverse me-2"></i> Catálogo
                </Nav.Link>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/login")} 
                  className={`nav-link-custom ${location.pathname === '/login' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi bi-person-circle me-2"></i> Acceso Admin
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
                      <i className="bi bi-house-fill me-2"></i> Inicio
                    </Nav.Link>
                    <Nav.Link 
                      onClick={() => manejarNavegacion("/dashboard")} 
                      className={`nav-link-custom ${location.pathname === '/dashboard' ? 'nav-link-active' : ''}`}
                    >
                      <i className="bi bi-bar-chart-fill me-2"></i> Dashboard
                    </Nav.Link>
                  </>
                )}
                {tienePermiso('ver_categorias') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/categorias")} 
                    className={`nav-link-custom ${location.pathname === '/categorias' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-grid-fill me-2"></i> Categorías
                  </Nav.Link>
                )}
                {tienePermiso('ver_productos') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/productos")} 
                    className={`nav-link-custom ${location.pathname === '/productos' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-box-seam-fill me-2"></i> Productos
                  </Nav.Link>
                )}
                {tienePermiso('ver_empleados') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/empleados")} 
                    className={`nav-link-custom ${location.pathname === '/empleados' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-people-fill me-2"></i> Empleados
                  </Nav.Link>
                )}
                {tienePermiso('ver_clientes') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/clientes")} 
                    className={`nav-link-custom ${location.pathname === '/clientes' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-person-lines-fill me-2"></i> Clientes
                  </Nav.Link>
                )}
                {tienePermiso('ver_ventas') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/ventas")} 
                    className={`nav-link-custom ${location.pathname === '/ventas' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-receipt-cutoff me-2"></i> Ventas
                  </Nav.Link>
                )}
                {tienePermiso('ver_permisos') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/permisos")} 
                    className={`nav-link-custom ${location.pathname === '/permisos' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-shield-lock-fill me-2"></i> Permisos
                  </Nav.Link>
                )}
                {tienePermiso('ver_catalogo') && (
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/catalogo")} 
                    className={`nav-link-custom ${location.pathname === '/catalogo' ? 'nav-link-active' : ''}`}
                  >
                    <i className="bi bi-layout-text-window-reverse me-2"></i> Catálogo
                  </Nav.Link>
                )}
                {estaLogueado && (
                  <Nav.Link 
                    onClick={() => setMostrarChatIA(true)} 
                    className="nav-link-custom"
                    style={{ color: '#FF1493' }}
                  >
                    <Badge bg="light" text="dark" className="me-2" style={{ background: 'linear-gradient(135deg, #FFD1DC, #FFB6C1)', color: '#AD1457' }}>
                      <i className="bi bi-robot me-1"></i>IA
                    </Badge>
                  </Nav.Link>
                )}
                <div className="ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">
                  <Button 
                    onClick={cerrarSesion}
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
                      border: 'none',
                      borderRadius: '15px',
                      color: '#880E4F',
                      fontWeight: 600
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Salir
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
