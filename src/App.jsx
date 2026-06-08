import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
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

const App = () => {
  return (
    <Router>
      <Encabezado />
      <div className="animate-fade-in">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/clientes" element={<RutaProtegida><Clientes /></RutaProtegida>} />
          <Route path="/ventas" element={<RutaProtegida><Ventas /></RutaProtegida>} />
          <Route path="/permisos" element={<RutaProtegida><Permisos /></RutaProtegida>} />
          <Route path="*" element={<RutaProtegida><Pagina404 /></RutaProtegida>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;