import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">ML Funcional</span>
        </div>
        
        <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsOpen(false)}
            end
          >
            Enviar
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/arquitectura" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsOpen(false)}
          >
            Arquitectura
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
