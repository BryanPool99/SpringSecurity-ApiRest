import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const checkAuthentication = () => {
    // Supongamos que guardas el token en localStorage
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token; // Si hay un token, el usuario está autenticado

    setIsLoggedIn(isAuthenticated);

    if (isAuthenticated) {
      // Si el usuario está autenticado, obtén el rol del token
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.rol[0].authority);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const handleLogout = () => {
    // Supongamos que necesitas realizar una solicitud al servidor para cerrar la sesión
    // Aquí simplemente eliminamos el token del localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("");
    navigate("/login");
  };

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header>
      <Navbar expand="sm" className="justify-content-center">
        <NavbarToggler className="bg-white" onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar className="navbar-nav align-items-center">
            {isLoggedIn ? (
              <NavItem className="nav-item">
                <NavLink className="nav-link" tag={Link} to="/home">
                  <span>Productos</span>
                </NavLink>
                {userRole === "ADMIN" && (
                  <NavLink className="nav-link" tag={Link} to="/maintenance">
                    <span>Maintenance</span>
                  </NavLink>
                )}
                <NavLink className="nav-link" onClick={handleLogout} tag={Link} to="/login">
                  <span>Logout</span>
                </NavLink>
              </NavItem>
            ) : (
              <NavItem className="nav-item">
                <NavLink className="nav-link" tag={Link} to="/category">
                  <span>Categories</span>
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};