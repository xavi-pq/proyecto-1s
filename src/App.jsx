import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Home from "./views/Home";
import Dashboard from "./views/Inicio";
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Empleados from "./views/Empleados";
import Clientes from "./views/Clientes";
import Ventas from "./views/Ventas";
import Permisos from "./views/Permisos";
import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const esLogin = location.pathname === "/login";
  
  return (
    <>
      {!esLogin && <Encabezado />}
      <div className="animate-fade-in">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/" element={<RutaProtegida><Home /></RutaProtegida>} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/clientes" element={<RutaProtegida><Clientes /></RutaProtegida>} />
          <Route path="/ventas" element={<RutaProtegida><Ventas /></RutaProtegida>} />
          <Route path="/permisos" element={<RutaProtegida><Permisos /></RutaProtegida>} />
          <Route path="*" element={<RutaProtegida><Pagina404 /></RutaProtegida>} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
