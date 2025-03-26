import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }} className="shadow p-4">
        <h3 className="text-center">{isSignUp ? "Sign Up" : "Login"}</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button variant="danger" className="w-100 mt-2" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
        </Form>

        <Row className="mt-3">
          <Col className="text-center">
            {isSignUp ? (
              <p>
                Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignUp(false)}>Login</span>
              </p>
            ) : (
              <p>
                Don't have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignUp(true)}>Sign Up</span>
              </p>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default AuthPage;
