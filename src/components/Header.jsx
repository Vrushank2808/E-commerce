import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { Container, Nav, Navbar, Button, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";

function Header() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/cart');
        const data = await response.json();
        setCartCount(data.length);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <span className="nav-link">Welcome, {user.displayName || user.email}</span>
                <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle rounded-circle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
                <Button variant="outline-danger" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button as={Link} to="/auth" variant="outline-primary">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
