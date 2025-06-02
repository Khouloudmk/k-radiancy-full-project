import React, { useContext, useEffect } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';


export default function DashboardScreen() {
const { state, dispatch } = useContext(Store);
  const { userInfo, dashboard } = state;
  const { loading, summary, error } = dashboard;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_DASHBOARD_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_DASHBOARD_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_DASHBOARD_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [dispatch, userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>{summary.overview.numUsers}</Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>{summary.overview.numOrders}</Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.overview.totalSales.toFixed(2)} DT
                  </Card.Title>
                  <Card.Text>Total Sales</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.overview.avgOrderValue.toFixed(2)} DT
                  </Card.Title>
                  <Card.Text>Avg. Order Value</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Status</Card.Title>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>Paid Orders</td>
                        <td>{summary.overview.paidOrders}</td>
                      </tr>
                      <tr>
                        <td>Delivered Orders</td>
                        <td>{summary.overview.deliveredOrders}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Items & Revenue</Card.Title>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>Total Items Sold</td>
                        <td>{summary.overview.totalItemsSold}</td>
                      </tr>
                      <tr>
                        <td>Total Shipping</td>
                        <td>{summary.overview.totalShipping.toFixed(2)} DT</td>
                      </tr>
                      <tr>
                        <td>Total Tax</td>
                        <td>{summary.overview.totalTax.toFixed(2)} DT</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-3">
            <h2>Sales Trend</h2>
            {summary.trends.dailyOrders.length === 0 ? (
              <Message>No Sales Data</Message>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales', 'Orders', 'Items Sold'],
                  ...summary.trends.dailyOrders.map((x) => [
                    x._id,
                    x.sales,
                    x.orders,
                    x.itemsSold,
                  ]),
                ]}
                options={{
                  title: 'Daily Sales Performance',
                  hAxis: { title: 'Date' },
                  vAxis: { title: 'Amount' },
                  series: {
                    0: { targetAxisIndex: 0 },
                    1: { targetAxisIndex: 1 },
                    2: { targetAxisIndex: 1 },
                  },
                }}
              />
            )}
          </div>

          <Row>
            <Col md={6}>
              <div className="my-3">
                <h2>Categories by Revenue</h2>
                {summary.trends.productCategories.length === 0 ? (
                  <Message>No Category Data</Message>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="PieChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ['Category', 'Revenue'],
                      ...summary.trends.productCategories.map((x) => [
                        x._id,
                        x.revenue,
                      ]),
                    ]}
                    options={{
                      title: 'Revenue by Category',
                      pieSliceText: 'value',
                    }}
                  />
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="my-3">
                <h2>Recent Orders</h2>
                {summary.recentOrders.length === 0 ? (
                  <Message>No Recent Orders</Message>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id.substring(0, 8)}...</td>
                          <td>{order.user?.name || 'Guest'}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>{order.totalPrice.toFixed(2)} DT</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
