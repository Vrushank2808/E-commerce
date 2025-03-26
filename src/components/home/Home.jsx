import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://fakestoreapi.com/products/categories");
      const data = await response.json();
      setCategories(["All", ...data]);
    } catch (error) {
      console.log("Error fetching categories: ", error);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log("Error fetching products: ", error);
    }
    setLoading(false);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="text-warning" />)}
        {halfStar && <FaStarHalfAlt className="text-warning" />}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-warning" />)}
      </>
    );
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center mb-3">
        <Col xs="auto">
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ButtonGroup>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={activeCategory === category ? "dark" : "outline-dark"}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" size="lg" />
            <p>Loading products...</p>
          </Col>
        ) : (
          filteredProducts.map((product, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.title}
                  style={{ height: "200px", objectFit: "contain", padding: "10px" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6">{product.title}</Card.Title>
                  <div className="d-flex align-items-center">
                    {renderStars(product.rating.rate)}
                    <span className="ms-2 text-muted">({product.rating.count})</span>
                  </div>
                  <Card.Text className="fw-bold text-primary">₹{Math.ceil(product.price * 85)}</Card.Text>
                  <Button variant="outline-primary" className="mt-auto" onClick={() => handleShowModal(product)}>
                    View Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={5} className="d-flex justify-content-center">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    style={{ maxWidth: "100%", height: "250px", objectFit: "contain" }}
                  />
                </Col>
                <Col md={7}>
                  <h5 className="text-primary">₹{Math.ceil(selectedProduct.price * 85)}</h5>
                  <div className="d-flex align-items-center">
                    {renderStars(selectedProduct.rating.rate)}
                    <span className="ms-2 text-muted">({selectedProduct.rating.count} reviews)</span>
                  </div>
                  <p className="mt-2">{selectedProduct.description}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <div className="d-flex gap-2">
                    <Button variant="warning" className="w-50">Add to Cart</Button>
                    <Button variant="success" className="w-50">Buy Now</Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default Home;
