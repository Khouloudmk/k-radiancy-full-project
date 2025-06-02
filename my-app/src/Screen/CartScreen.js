import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Card,
  CardBody,
} from 'react-bootstrap';
import Error from '../components/Message';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareMinus,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

// functional component for cart page
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // async function to get the cart items from the server(backend)
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.stock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    contextDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  // function to remove item from cart
  const removeItemHandler = (item) => {
    contextDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  // function to checkout
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="mb-4">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Error>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </Error>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />
                      {''}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <FontAwesomeIcon
                          icon={faSquareMinus}
                          style={{ color: '#B197FC' }}
                        />
                      </Button>
                      {''}
                      <span>{item.quantity}</span>
                      {''}
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant="light"
                        disabled={item.quantity === item.stock}
                      >
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          style={{ color: '#B197FC' }}
                        />
                      </Button>
                    </Col>
                    <Col md={3}>{item.price} DT</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: '#B197FC' }}
                        />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    {''} items) :{' '}
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} DT
                  </h3>
                </ListGroupItem>
                <ListGroupItem>
                  <div className="d-grid">
                    <Button
                      onClick={checkoutHandler}
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="my-3"
          >
            <FontAwesomeIcon icon={faCircleLeft} className="me-2" />
            Back to Home
          </Button>
        </Col>
      </Row>
    </div>
  );
}
