import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  // Initialize userInfo from localStorage or set to null if not available in localStorage
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  // Initialize cart with shipping address, payment method, and card info from localStorage
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    paymentMethod: localStorage.getItem('paymentMethod') || '',

    cardInfo: {
      cardNumber: localStorage.getItem('cardNumber') || '',
      cardName: localStorage.getItem('cardName') || '',
      expiryDate: localStorage.getItem('expiryDate') || '',
    },

    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },

  // Initialize products from localStorage or set to an empty array if not available
  products: [],
  loading: true,
  error: '',
  pages: 0,
  countProducts: 0,

  // Initialize order with loading state, error, and empty data
  order: {
    loading: true,
    error: '',
    data: {},
  },

  // Initialize order history with loading state, error, and empty orders
  orderHistory: {
    loading: true,
    error: '',
    orders: [],
  },

  // Initialize loading states for profile update and order actions
  loadingProfile: false,
  loadingUpdate: false,

  // Initialize order actions with loading and success states
  loadingCreateOrder: false,
  successPay: false,
  loadingDeliver: false,
  successDeliver: false,


  // Initialize dashboard with loading state and empty summary
  dashboard: {
    loading: true,
    summary: null,
    error: '',
  },

  // Initialize order deletion state
  loadingDelete: false,
  successDelete: false,

};

function reducer(state, action) {
  switch (action.type) {
    // Cart actions
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_CLEAR':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };

    // User actions
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
          cardInfo: {
            cardNumber: '',
            cardName: '',
            expiryDate: '',
          },
        },
      };

    // Shipping, payment, card info
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    case 'SAVE_CARD_INFO':
      return {
        ...state,
        cart: {
          ...state.cart,
          cardInfo: {
            cardNumber: action.payload.cardNumber,
            cardName: action.payload.cardName,
            expiryDate: action.payload.expiryDate,
          },
        },
      };

    // Products actions
    case 'FETCH_PRODUCTS_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, loading: false, products: action.payload };

    case 'FETCH_PRODUCTS_FAILURE':
      return { ...state, loading: false, error: action.payload };

    // Order actions
    case 'FETCH_ORDER_REQUEST':
      return {
        ...state,
        order: { ...state.order, loading: true },
      };
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        order: { loading: false, data: action.payload, error: '' },
      };
    case 'FETCH_ORDER_FAIL':
      return {
        ...state,
        order: { ...state.order, loading: false, error: action.payload },
      };

    // Deliver order actions
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };

    // Order history actions
    case 'FETCH_ORDER_HISTORY_REQUEST':
      return {
        ...state,
        orderHistory: { ...state.orderHistory, loading: true },
      };

    case 'FETCH_ORDER_HISTORY_SUCCESS':
      return {
        ...state,
        orderHistory: {
          loading: false,
          orders: action.payload,
          error: '',
        },
      };

    case 'FETCH_ORDER_HISTORY_FAIL':
      return {
        ...state,
        orderHistory: {
          ...state.orderHistory,
          loading: false,
          error: action.payload,
        },
      };

    // Profile update actions
    case 'UPDATE_PROFILE_REQUEST':
      return { ...state, loadingUpdate: true };

    case 'UPDATE_PROFILE_SUCCESS':
      return { ...state, loadingUpdate: false };

    case 'UPDATE_PROFILE_FAIL':
      return { ...state, loadingUpdate: false };

    // Search products actions
    case 'FETCH_SEARCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
      };
    case 'FETCH_SEARCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Orders actions
    case 'DELETE_ORDERS_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_ORDERS_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_ORDERS_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_ORDERS_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    // Dashboard actions
    case 'FETCH_DASHBOARD_REQUEST':
      return {
        ...state,
        dashboard: { ...state.dashboard, loading: true },
      };
    case 'FETCH_DASHBOARD_SUCCESS':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          loading: false,
          summary: action.payload,
          error: '',
        },
      };
    case 'FETCH_DASHBOARD_FAIL':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
