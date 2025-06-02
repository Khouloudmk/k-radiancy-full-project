import React, { useReducer, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Col,
  Row,
  ListGroup,
  Card,
  CardBody,
  ListGroupItem,
  Badge,
  Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

import Rating from '../components/Rating';
import Loading from '../components/Loading';
import Error from '../components/Message';
import { Store } from '../Store';
import { getError } from '../utils';

// Reducer for product fetch
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCT_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_PRODUCT_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_PRODUCT_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { state: contextState, dispatch: contextDispatch } = useContext(Store);
  const { cart } = contextState;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: {},
    loading: true,
    error: '',
  });

  // Fetch product
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_PRODUCT_FAILURE', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // Add to cart
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.stock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    contextDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  if (loading) return <Loading />;
  if (error) return <Error variant="danger">{error}</Error>;

  return (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      <h1 className="text-center text-bg">{product.name}</h1>
      <Row className="d-flex justify-content-center align-items-start">
        <Col md={5} className="img-container me-3">
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>

        <Col md={3}>
          <Card>
            <CardBody>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h2>{product.brand}</h2>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <p>{product.description}</p>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>

          {/* <Col md={5} className="mt-4 mb-2">
         
          </Col> */}

          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="my-3"
          >
            <FontAwesomeIcon icon={faCircleLeft} className="me-2" />
            Back to Home
          </Button>
        </Col>

        <Col md={3}>
          <Card>
            <CardBody>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>{product.price} DT</strong>
                    </Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.stock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroupItem>

                {product.stock > 0 && (
                  <ListGroupItem>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroupItem>
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
