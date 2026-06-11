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
        background: "linear-gradient(135deg, #fff0f5 0%, #ffd6e8 50%, #ffb6c1 100%)",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        {/* Hero */}
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow"
                style={{
                  width: 90,
                  height: 90,
                  background: "linear-gradient(135deg, #ff69b4, #ffb6c1)",
                }}
              >
                <i className="bi bi-shop text-white" style={{ fontSize: 40 }} />
              </div>
            </div>
            <h1 className="fw-bold mb-3" style={{ color: "#c2185b", fontSize: "2.5rem" }}>
              Bienvenid@ a Discosa
            </h1>
            <p className="text-muted fs-5 mb-4">
              Tu sistema de gestión de ventas, clientes y empleados — todo en un solo lugar 🌸
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {tienePermiso("ver_inicio") && (
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  style={{
                    background: "linear-gradient(135deg, #ff69b4, #ff1493)",
                    border: "none",
                    borderRadius: 30,
                    paddingInline: 32,
                    boxShadow: "0 4px 15px rgba(255,105,180,0.4)",
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
                  style={{ borderRadius: 30, paddingInline: 32 }}
                >
                  <i className="bi bi-receipt-cutoff me-2" />
                  Ir a Ventas
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Módulos */}
        <Row className="g-4 justify-content-center">
          {tienePermiso("ver_ventas") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/ventas")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #ff69b4, #ffb6c1)" }}
                  >
                    <i className="bi bi-receipt-cutoff text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Ventas</h6>
                  <small className="text-muted">Registra y gestiona</small>
                </Card.Body>
              </Card>
            </Col>
          )}
          {tienePermiso("ver_clientes") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/clientes")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #e91e8c, #ff69b4)" }}
                  >
                    <i className="bi bi-person-lines-fill text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Clientes</h6>
                  <small className="text-muted">Base de clientes</small>
                </Card.Body>
              </Card>
            </Col>
          )}
          {tienePermiso("ver_productos") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/productos")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #ad1457, #e91e8c)" }}
                  >
                    <i className="bi bi-box-seam-fill text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Productos</h6>
                  <small className="text-muted">Inventario</small>
                </Card.Body>
              </Card>
            </Col>
          )}
          {tienePermiso("ver_empleados") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/empleados")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #ff69b4, #c2185b)" }}
                  >
                    <i className="bi bi-people-fill text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Empleados</h6>
                  <small className="text-muted">Gestión de equipo</small>
                </Card.Body>
              </Card>
            </Col>
          )}
          {tienePermiso("ver_categorias") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/categorias")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #f06292, #ffb6c1)" }}
                  >
                    <i className="bi bi-grid-fill text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Categorías</h6>
                  <small className="text-muted">Organización</small>
                </Card.Body>
              </Card>
            </Col>
          )}
          {tienePermiso("ver_catalogo") && (
            <Col xs={6} md={4} lg={3}>
              <Card
                className="text-center border-0 h-100 shadow-sm"
                style={{ borderRadius: 18, cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate("/catalogo")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Card.Body className="py-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56, background: "linear-gradient(135deg, #ffd1dc, #ff69b4)" }}
                  >
                    <i className="bi bi-layout-text-window-reverse text-white fs-4" />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#c2185b" }}>Catálogo</h6>
                  <small className="text-muted">Vista pública</small>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
