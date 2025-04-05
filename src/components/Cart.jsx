import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../Auth/AuthContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/cart');
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart items');
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                fetchCart();
                toast.success('Cart updated');
            } else {
                toast.error('Failed to update cart');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update cart');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCart();
                toast.success('Item removed from cart');
            } else {
                toast.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handlePayment = async () => {
        if (!user) {
            toast.warning('Please login to proceed with payment');
            return;
        }

        try {
            const order = {
                userId: user.uid,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date().toISOString(),
                status: 'completed'
            };

            const orderResponse = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            if (orderResponse.ok) {
                await Promise.all(
                    cart.map(item =>
                        fetch(`http://localhost:3000/cart/${item.id}`, {
                            method: 'DELETE',
                        })
                    )
                );

                setShowPaymentModal(false);
                fetchCart();
                toast.success('Payment successful! Thank you for your purchase.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Error processing payment. Please try again.');
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Container className="py-4">
            <h2 className="mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
                <Card>
                    <Card.Body className="text-center">
                        <h4>Your cart is empty</h4>
                        <Button variant="primary" href="/">Continue Shopping</Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    <ListGroup>
                        {cart.map((item) => (
                            <ListGroup.Item key={item.id}>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <h5>{item.title}</h5>
                                        <p className="text-muted mb-0">${item.price}</p>
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <p className="mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <Card className="mt-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Total: ${total.toFixed(2)}</h4>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowPaymentModal(true)}
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Payment Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Expiry Date</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/YY"
                                                value={paymentDetails.expiryDate}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="123"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cardholder Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="John Doe"
                                        value={paymentDetails.name}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handlePayment}>
                                Pay ${total.toFixed(2)}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

export default Cart; 