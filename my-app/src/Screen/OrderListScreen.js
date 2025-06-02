import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo, orderHistory = {} } = state;
  const {
    loading = true,
    error = '',
    orders = [],
    successDelete,
  } = orderHistory;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_ORDER_HISTORY_REQUEST' });
        const { data } = await axios.get('/api/orders/', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_ORDER_HISTORY_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ORDER_HISTORY_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_ORDERS_RESET' });
    }

    fetchData();
  }, [dispatch, userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_ORDERS_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Order deleted successfully');
        dispatch({ type: 'DELETE_ORDERS_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_ORDERS_FAIL' });
      }
    }
  };

  const markAsPaidHandler = async (order) => {
    if (window.confirm('Mark this order as paid?')) {
      try {
        await axios.put(
          `/api/orders/${order._id}/pay`,
          {}, // empty body
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Order marked as paid');
        dispatch({ type: 'DELETE_ORDERS_RESET' }); // triggers re-fetch
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.user?.name || order.user?.email || 'DELETED USER'}
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="warning"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>{' '}
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>{' '}
                  {!order.isPaid && (
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => markAsPaidHandler(order)}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
