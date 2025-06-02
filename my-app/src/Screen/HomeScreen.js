import axios from 'axios';
import React, { useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import Error from '../components/Message';
import { Store } from '../Store';
import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKipSign } from '@fortawesome/free-solid-svg-icons';

function HomeScreen() {
  const { state, dispatch } = useContext(Store);
  const { loading, error, products } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: error.message });
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <Error variant="danger">{error}</Error>;

  return (
    <div>
      <Helmet>
        <title>K-radiancy</title>
      </Helmet>
      <div className="text-center mt-4">
        <h1>Unlock Your Radiant Skin</h1>
        <p>Your Skin Journey Begins Here ✨</p>
      </div>
      <MDBCarousel>
        <MDBCarouselItem itemId={1}>
          <img
            src="https://i.imgur.com/mjMV6YV.jpg"
            className="d-block w-100"
            alt="..."
          />
        </MDBCarouselItem>
        <MDBCarouselItem itemId={2}>
          <img
            src="https://i.imgur.com/JaHkci1.jpg"
            className="d-block w-100"
            alt="..."
          />
        </MDBCarouselItem>
        <MDBCarouselItem itemId={3}>
          <img
            src="https://i.imgur.com/2nHZINk.jpg"
            className="d-block w-100"
            alt="..."
          />
        </MDBCarouselItem>
      </MDBCarousel>
      <h2 className="text-center mt-4 mb-4">
        <FontAwesomeIcon icon={faKipSign} beat style={{ color: '#0d6efd' }} />
        radiancy Skincare Brands
      </h2>
      <div className="tag-list">
        <div className="inner">
          <span className="tag">COSRX</span>
          <span className="tag">Innisfree</span>
          <span className="tag">K-SECRET</span>
          <span className="tag">COSRX</span>
          <span className="tag">Beauty Of Joseon</span>
          <span className="tag">SKIN 1004</span>
          <span className="tag">ANUA</span>
          <span className="tag">SOME BY MI</span>
        </div>
      </div>

      <div className="text-center mt-4 mb-4">
        <h1>Featured Products</h1>
        <p>For A Fresh And Radiant Glow ✨</p>
      </div>
      <div className="products mb-4">
        <Row>
          {Array.isArray(products) &&
            products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={2} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
}

export default HomeScreen;
