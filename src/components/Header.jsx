import { useAuth } from "../Auth/AuthContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function Header() {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          {user ? (
            <>
              <span className="me-3">{user.email}</span>
              <Button variant="outline-danger" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button variant="outline-success" href="/auth">Login</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
