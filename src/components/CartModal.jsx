import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

function CartModal({ show, handleClose }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [show]); 

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length > 0 ? (
          <ListGroup>
            {cart.map((item, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between">
                <span>{item.title}</span>
                <strong>₹{Math.ceil(item.price * 85)}</strong>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center">Your cart is empty</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
