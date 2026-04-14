import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [tema, setTema] = useState(localStorage.getItem("tema") || "light");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(tema === "light" ? "dark" : "light");
  };

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  const estaLogueado = !!localStorage.getItem("usuario-supabase");
  const esLogin = location.pathname === "/login";

  return (
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
          <Button 
            variant="link" 
            onClick={toggleTema} 
            className="text-primary p-0 me-2 shadow-none border-0"
          >
            <i className={`bi ${tema === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'} h4 mb-0`}></i>
          </Button>
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
            {/* Theme Toggle Desktop */}
            <Button 
              variant="link" 
              onClick={toggleTema} 
              className="nav-link-custom d-none d-lg-flex align-items-center justify-content-center text-decoration-none border-0"
            >
              <i className={`bi ${tema === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'} h5 mb-0`}></i>
            </Button>

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
                <Nav.Link 
                  onClick={() => manejarNavegacion("/")} 
                  className={`nav-link-custom ${location.pathname === '/' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-house-fill me-2"></i> Inicio
                </Nav.Link>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/categorias")} 
                  className={`nav-link-custom ${location.pathname === '/categorias' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-grid-fill me-2"></i> Categorías
                </Nav.Link>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/productos")} 
                  className={`nav-link-custom ${location.pathname === '/productos' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-box-seam-fill me-2"></i> Productos
                </Nav.Link>
                <Nav.Link 
                  onClick={() => manejarNavegacion("/catalogo")} 
                  className={`nav-link-custom ${location.pathname === '/catalogo' ? 'nav-link-active' : ''}`}
                >
                  <i className="bi-layout-text-window-reverse me-2"></i> Catálogo
                </Nav.Link>
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
  );
};

export default Encabezado;