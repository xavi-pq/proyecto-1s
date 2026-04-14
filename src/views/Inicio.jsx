import React from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="hero-section text-white py-5 mb-5 rounded-bottom-5 shadow-lg">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={7} className="animate-fade-in-up">
              <Badge bg="white" className="text-primary rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">
                ¡Bienvenido a Discosa!
              </Badge>
              <h1 className="display-3 fw-bold mb-4">
                Tu Inventario, <br/>
                <span className="text-info">Simplificado.</span>
              </h1>
              <p className="lead mb-5 opacity-75 fs-4">
                Gestiona tus productos y categorías de forma profesional con nuestra plataforma moderna y segura.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="info" 
                  size="lg"
                  className="btn-rounded text-white shadow-lg px-4" 
                  onClick={() => navigate('/productos')}
                >
                  Ver Inventario <i className="bi-arrow-right ms-2"></i>
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  className="btn-rounded px-4" 
                  onClick={() => navigate('/categorias')}
                >
                  Categorías
                </Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block animate-fade-in-up delay-2">
              <div className="bg-white bg-opacity-10 rounded-5 shadow-lg p-5 text-center backdrop-blur border border-white border-opacity-20">
                <i className="bi-box-seam text-white display-1 mb-4 d-block"></i>
                <h2 className="text-white fw-bold">Discosa System</h2>
                <p className="text-white-50 mb-0">v1.0.0 Stable</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="mb-5 pb-5">
        <Row className="g-4">
          <Col md={4} className="animate-fade-in-up delay-1">
            <div className="stats-card h-100">
              <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-4 mb-4">
                <i className="bi-lightning-charge-fill text-primary h3 mb-0"></i>
              </div>
              <h4 className="fw-bold mb-3">Velocidad Real</h4>
              <p className="text-muted mb-0">Consultas optimizadas para una respuesta instantánea en tu gestión diaria.</p>
            </div>
          </Col>
          <Col md={4} className="animate-fade-in-up delay-2">
            <div className="stats-card h-100">
              <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-4 mb-4">
                <i className="bi-shield-check text-success h3 mb-0"></i>
              </div>
              <h4 className="fw-bold mb-3">Seguridad Total</h4>
              <p className="text-muted mb-0">Tus datos están protegidos con políticas de seguridad de grado industrial.</p>
            </div>
          </Col>
          <Col md={4} className="animate-fade-in-up delay-3">
            <div className="stats-card h-100">
              <div className="bg-info bg-opacity-10 d-inline-flex p-3 rounded-4 mb-4">
                <i className="bi-grid-fill text-info h3 mb-0"></i>
              </div>
              <h4 className="fw-bold mb-3">Control Total</h4>
              <p className="text-muted mb-0">Organiza todo por categorías para mantener tu catálogo siempre ordenado.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inicio;