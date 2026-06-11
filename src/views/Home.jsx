import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff5f8 0%, #ffe0e8 40%, #ffd1dc 100%)",
        paddingTop: "120px",
        paddingBottom: "60px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background elements */}
      <div 
        style={{
          position: "absolute",
          top: "15%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,105,180,0.15) 0%, rgba(255,105,180,0) 70%)",
          borderRadius: "50%",
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,20,147,0.12) 0%, rgba(255,20,147,0) 70%)",
          borderRadius: "50%",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <Row className="justify-content-center text-center mb-5">
          <Col md={10} lg={8}>
            <div className="mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-5 shadow-lg"
                style={{
                  width: 120,
                  height: 120,
                  background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
                  animation: "float 3s ease-in-out infinite"
                }}
              >
                <i className="bi bi-shop text-white" style={{ fontSize: 56 }} />
              </div>
            </div>
            <h1 
              className="fw-bold mb-4"
              style={{ 
                color: "#880e4f", 
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                letterSpacing: "-1px",
                textShadow: "0 2px 20px rgba(136,14,79,0.1)"
              }}
            >
              Bienvenid@ a <span style={{ color: "#c2185b" }}>Discosa</span>
            </h1>
            <p 
              className="mb-5"
              style={{ 
                color: "#616161", 
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                lineHeight: "1.7"
              }}
            >
              Tu sistema completo de gestión de ventas, clientes, productos y empleados — todo en un solo lugar, diseñado para hacer tu trabajo más fácil 🌸
            </p>
            <div className="d-flex gap-4 justify-content-center flex-wrap">
              {tienePermiso("ver_inicio") && (
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-3 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
                    border: "none",
                    borderRadius: 50,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 25px rgba(255,105,180,0.35)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 12px 35px rgba(255,105,180,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 25px rgba(255,105,180,0.35)";
                  }}
                >
                  <i className="bi bi-grid-fill me-2" />
                  Ver Dashboard
                </Button>
              )}
              {tienePermiso("ver_ventas") && (
                <Button
                  size="lg"
                  variant="outline-danger"
                  onClick={() => navigate("/ventas")}
                  className="px-5 py-3"
                  style={{ 
                    borderRadius: 50, 
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderColor: "#c2185b",
                    color: "#c2185b"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#fff0f5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  <i className="bi bi-receipt-cutoff me-2" />
                  Ir a Ventas
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Módulos */}
        <Row className="g-5 justify-content-center">
          {tienePermiso("ver_ventas") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/ventas")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(194,24,91,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #ff69b4, #ff1493)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #ff69b4, #ffb6c1)",
                      boxShadow: "0 8px 20px rgba(255,105,180,0.25)"
                    }}
                  >
                    <i className="bi bi-receipt-cutoff text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Ventas</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Registra y gestiona tus ventas</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {tienePermiso("ver_clientes") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/clientes")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(233,30,99,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #e91e8c, #ff69b4)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #e91e8c, #ff69b4)",
                      boxShadow: "0 8px 20px rgba(233,30,99,0.25)"
                    }}
                  >
                    <i className="bi bi-person-lines-fill text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Clientes</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Tu base de clientes</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {tienePermiso("ver_productos") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/productos")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(173,20,87,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #ad1457, #e91e8c)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #ad1457, #e91e8c)",
                      boxShadow: "0 8px 20px rgba(173,20,87,0.25)"
                    }}
                  >
                    <i className="bi bi-box-seam-fill text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Productos</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Gestiona tu inventario</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {tienePermiso("ver_empleados") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/empleados")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(194,24,91,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #ff69b4, #c2185b)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #ff69b4, #c2185b)",
                      boxShadow: "0 8px 20px rgba(255,105,180,0.25)"
                    }}
                  >
                    <i className="bi bi-people-fill text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Empleados</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Gestión de tu equipo</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {tienePermiso("ver_categorias") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/categorias")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(240,98,146,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #f06292, #ffb6c1)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #f06292, #ffb6c1)",
                      boxShadow: "0 8px 20px rgba(240,98,146,0.25)"
                    }}
                  >
                    <i className="bi bi-grid-fill text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Categorías</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Organiza tus productos</p>
                </Card.Body>
              </Card>
            </Col>
          )}

          {tienePermiso("ver_catalogo") && (
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm overflow-hidden"
                style={{ 
                  borderRadius: 24, 
                  cursor: "pointer", 
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "white"
                }}
                onClick={() => navigate("/catalogo")}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(255,209,220,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "6px", background: "linear-gradient(90deg, #ffd1dc, #ff69b4)" }} />
                <Card.Body className="py-5 px-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{ 
                      width: 72, 
                      height: 72, 
                      background: "linear-gradient(135deg, #ffd1dc, #ff69b4)",
                      boxShadow: "0 8px 20px rgba(255,209,220,0.35)"
                    }}
                  >
                    <i className="bi bi-layout-text-window-reverse text-white fs-1" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: "#880e4f", fontSize: "1.2rem" }}>Catálogo</h5>
                  <p className="mb-0" style={{ color: "#757575", fontSize: "0.95rem" }}>Vista pública</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
