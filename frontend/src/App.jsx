import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import FormularioMensaje from './components/FormularioMensaje';
import Dashboard from './components/Dashboard';
import Arquitectura from './components/Arquitectura';

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FormularioMensaje />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/arquitectura" element={<Arquitectura />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
