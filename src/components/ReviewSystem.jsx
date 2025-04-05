import { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import { toast } from 'react-toastify';

const ReviewSystem = ({ productId, onReviewAdded }) => {
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:3000/reviews?productId=${productId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.warning('Please login to add a review');
            return;
        }

        const newReview = {
            productId,
            userId: user.uid,
            userName: user.displayName || user.email,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const response = await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });

            if (response.ok) {
                setRating(0);
                setComment('');
                setShowModal(false);
                fetchReviews();
                onReviewAdded && onReviewAdded();
                toast.success('Review added successfully');
            } else {
                toast.error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add review');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-warning" />);
            } else if (i - 0.5 === rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-warning" />);
            }
        }
        return stars;
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="mt-4">
            <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                    {renderStars(averageRating)}
                </div>
                <span className="text-muted">
                    ({reviews.length} reviews)
                </span>
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-3"
                    onClick={() => setShowModal(true)}
                >
                    Add Review
                </Button>
            </div>

            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between">
                            <strong>{review.userName}</strong>
                            <small className="text-muted">{review.date}</small>
                        </div>
                        <div className="mb-2">
                            {renderStars(review.rating)}
                        </div>
                        <p className="mb-0">{review.comment}</p>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <div className="d-flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className="me-2"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {star <= (hoverRating || rating) ? (
                                            <FaStar className="text-warning" />
                                        ) : (
                                            <FaRegStar className="text-warning" />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit Review
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ReviewSystem; 