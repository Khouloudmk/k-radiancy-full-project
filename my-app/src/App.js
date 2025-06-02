import { Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/ProductScreen';
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './Screen/CartScreen';
import SigninScreen from './Screen/SignInScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './Screen/ShippingAddressScreen';
import SignUpScreen from './Screen/SignUpScreen';
import PaymentMethodScreen from './Screen/PaymentMethodScreen';
import PlaceOrderScreen from './Screen/PlaceOrderScreen';
import OrderScreen from './Screen/OrderScreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import ProfileScreen from './Screen/ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faKipSign } from '@fortawesome/free-solid-svg-icons';
import { SearchBox } from './components/SearchBox';
import { SearchScreen } from './Screen/SearchScreen';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './Screen/DashboardScreen';
import ProtectedRoute from './components/ProtectedRoute';
import ProductListScreen from './Screen/ProductListScreen';
import ProductEditScreen from './Screen/ProductEditScreen';
import OrderListScreen from './Screen/OrderListScreen';
import UserListScreen from './Screen/UserListScreen';
import UserEditScreen from './Screen/UserEditScreen';
import ForgetPasswordScreen from './Screen/ForgetPasswordScreen';
import ResetPasswordScreen from './Screen/ResetPasswordScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('cardNumber');
    localStorage.removeItem('cardName');
    localStorage.removeItem('expiryDate');
    window.location.href = '/signin';
  };

  return (
    <>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="mx-5">
          <Navbar>
            <Container>
              <Navbar.Brand className="fs-5 fw-bold" as={Link} to="/">
                <FontAwesomeIcon
                  icon={faKipSign}
                  beat
                  style={{ color: '#0d6efd' }}
                />
                radiancy
              </Navbar.Brand>
              <SearchBox />
              <Nav className="my-auto gap-3 nav-links">
                <Nav.Link as={Link} to="/cart">
                  <p className="ms-2">
                    Shop Now{' '}
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      beat
                      size="xl"
                      style={{ color: '#0d6efd' }}
                    />
                  </p>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger" className="ms-1">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Nav.Link>

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="user-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">
                      User Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orderhistory">
                      Order History
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={signoutHandler}>
                      Sign Out
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/signin">
                    Sign In
                  </Nav.Link>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Users
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              {/* User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </main>
      </div>
    </>
  );
}

export default App;
