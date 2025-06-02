import React, { useContext, useEffect, useState, useReducer } from 'react'; 
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Loading from '../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log('Checking if payment and shipping info exist...');
    if (!cart.paymentMethod) {
      console.warn('Redirecting to /payment');
      navigate('/payment');
    } else if (!cart.shippingAddress) {
      console.warn('Redirecting to /shipping');
      navigate('/shipping');
    }
  }, [cart, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', {
      cardName,
      cardNumber,
      expiryDate,
      cvv,
    });

    if (cardNumber.length < 16 || !cardName || !expiryDate || !cvv) {
      console.error('Invalid card information');
      alert('Please fill all card fields correctly.');
      return;
    }

    ctxDispatch({
      type: 'SAVE_CARD_INFO',
      payload: {
        cardNumber: cardNumber.slice(-4),
        cardName,
        expiryDate,
      },
    });

    console.log('Card info saved to context');
    setSubmitted(true);
  };

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  console.log('Calculated Prices:', {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const placeOrderHandler = async () => {
    console.log('Placing order...');
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems.map((item) => ({
            ...item,
            product: item._id,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log('API response data:', data);
      console.log('Order created successfully:', data);

      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data._id}`);
    } catch (err) {
      console.error('Error placing order:', getError(err));
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          {/* Shipping Card */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          {/* Payment Card */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>

              {cart.paymentMethod === 'CreditCard' && (
                <>
                  {!submitted ? (
                    <Form className="mt-3" onSubmit={handleSubmit}>
                      <Form.Group className="mb-2" controlId="cardName">
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2" controlId="cardNumber">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          maxLength="16"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2" controlId="expiryDate">
                        <Form.Label>Expiry Date (MM/YY)</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="cvv">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="password"
                          required
                          maxLength="4"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button type="submit" variant="primary">
                          Save Payment Info
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="mt-3">
                      <p>
                        <strong>Card:</strong> **** **** ****{' '}
                        {cardNumber.slice(-4)} <br />
                        <strong>Name:</strong> {cardName}
                      </p>
                    </div>
                  )}
                </>
              )}
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          {/* Items Card */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>{item.price.toFixed(2)} DT</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{itemsPrice.toFixed(2)} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{shippingPrice.toFixed(2)} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>{taxPrice.toFixed(2)} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>{totalPrice.toFixed(2)} DT</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    {loading && <Loading />}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}