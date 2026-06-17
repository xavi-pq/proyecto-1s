import React from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

const FormularioLogin = ({
  usuario,
  contrasena,
  error,
  setUsuario,
  setContrasena,
  iniciarSesion,
  cargando
}) => {
  return (
    <Card 
      style={{ 
        minWidth: "320px", 
        maxWidth: "420px", 
        width: "100%", 
        borderRadius: "30px",
        border: "none",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 60px rgba(173, 20, 87, 0.2)"
      }} 
      className="p-5"
    >
      <Card.Body className="p-0">
        {/* Header with cute icon */}
        <div className="text-center mb-5">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow"
            style={{ 
              width: 100, 
              height: 100, 
              background: "linear-gradient(135deg, #FF69B4, #FF1493)",
              animation: "float 3s ease-in-out infinite"
            }}
          >
            <i className="bi bi-shop" style={{ fontSize: 50, color: "white" }}></i>
          </div>
          <h2 
            className="fw-bold mb-2"
            style={{ 
              color: "#880E4F",
              fontSize: "2rem",
              letterSpacing: "-0.5px"
            }}
          >
            Bienvenida a
          </h2>
          <h1 
            className="fw-bold mb-1"
            style={{ 
              color: "#AD1457",
              fontSize: "2.5rem",
              letterSpacing: "-1px"
            }}
          >
            DISCOSA
          </h1>
          <p 
            className="text-muted"
            style={{ fontSize: "1rem" }}
          >
            Inicia sesión para continuar 🌸
          </p>
        </div>
        
        {error && (
          <Alert 
            variant="danger" 
            className="mb-4 text-center border-0"
            style={{ 
              backgroundColor: "#FFEBEE",
              color: "#C62828",
              borderRadius: "15px"
            }}
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-4" controlId="usuario">
            <Form.Label 
              className="fw-semibold mb-2"
              style={{ color: "#880E4F" }}
            >
              <i className="bi bi-envelope me-2"></i>
              Correo Electrónico
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@discosa.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={{
                borderRadius: "15px",
                padding: "12px 18px",
                border: "2px solid #FFE0E9",
                transition: "all 0.3s ease",
                backgroundColor: "#FFF5F9"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF69B4";
                e.target.style.boxShadow = "0 0 0 4px rgba(255, 105, 180, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#FFE0E9";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>

          <Form.Group className="mb-5" controlId="contrasena">
            <Form.Label 
              className="fw-semibold mb-2"
              style={{ color: "#880E4F" }}
            >
              <i className="bi bi-lock me-2"></i>
              Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{
                borderRadius: "15px",
                padding: "12px 18px",
                border: "2px solid #FFE0E9",
                transition: "all 0.3s ease",
                backgroundColor: "#FFF5F9"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF69B4";
                e.target.style.boxShadow = "0 0 0 4px rgba(255, 105, 180, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#FFE0E9";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>

          <Button 
            className="w-100 py-3 shadow" 
            onClick={iniciarSesion}
            disabled={cargando}
            style={{
              background: "linear-gradient(135deg, #FF69B4, #FF1493)",
              border: "none",
              borderRadius: "15px",
              fontSize: "1.1rem",
              fontWeight: 600,
              letterSpacing: "0.5px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (!cargando) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 10px 30px rgba(255, 20, 147, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 5px 15px rgba(255, 105, 180, 0.3)";
            }}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="bi bi-heart-fill me-2"></i>
                Iniciar Sesión
              </>
            )}
          </Button>
        </Form>

        {/* Cute footer */}
        <div className="text-center mt-5 pt-4" style={{ borderTop: "1px dashed #FFC1CC" }}>
          <p className="mb-0 text-muted small">
            <i className="bi bi-flower1 me-1"></i>
            ¡Gracias por ser parte de DISCOSA!
          </p>
        </div>
      </Card.Body>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Card>
  );
};

export default FormularioLogin;
