import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import FormularioPrincipal from './views/FormularioPrincipal';




function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/terminosypoliticas/formulario/:valorFiltro/:url" element={<FormularioPrincipal/>} />
          <Route path="/" element={<Navigate to="/terminosypoliticas/formulario/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

