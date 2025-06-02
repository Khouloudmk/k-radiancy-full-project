import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

export default function OrderScreen() {
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    order: { loading, error, data: order },
    successPay,
    loadingDeliver,
    successDeliver,
  } = state;

  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_ORDER_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_ORDER_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ORDER_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!order?._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [dispatch, order, userInfo, orderId, navigate, successPay]);

  // Handle successful delivery
  useEffect(() => {
    const fetchOrderAfterDeliver = async () => {
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_ORDER_SUCCESS', payload: data });
      dispatch({ type: 'DELIVER_RESET' });
    };

    if (successDeliver) {
      fetchOrderAfterDeliver();
    }
  }, [successDeliver, dispatch, orderId, userInfo]);

  // Deliver handler
  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });

      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order marked as delivered');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL' });
      toast.error(getError(err));
    }
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress?.fullName} <br />
                <strong>Address:</strong>{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </Card.Text>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <Message variant="success">Paid at {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems?.map((item) => (
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
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>{item.price} DT</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                {userInfo.isAdmin && !order.isDelivered && (
                  <ListGroup.Item>
                    <>
                      {loadingDeliver && <Loading />}
                      <div className="d-grid">
                        <Button type="button" onClick={deliverOrderHandler}>
                          Deliver Order
                        </Button>
                      </div>
                    </>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{order.itemsPrice?.toFixed(2) || '0.00'} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{order.shippingPrice?.toFixed(2) || '0.00'} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>{order.taxPrice?.toFixed(2) || '0.00'} DT</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>
                        {order.totalPrice?.toFixed(2) || '0.00'} DT
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
