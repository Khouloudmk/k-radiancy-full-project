import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Message from '../components/Message';
import Loading from '../components/Loading';
import Product from '../components/Product';

export const SearchScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get search query from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Decode and clean the search query
        const decodedQuery = decodeURIComponent(searchQuery).trim().toLowerCase();

        if (!decodedQuery) {
          setProducts([]);
          return;
        }

        // Make API call to search endpoint with multiple search fields
        const { data } = await axios.get(`/api/products/search`, {
          params: {
            q: decodedQuery,
            fields: ['name', 'brand', 'query'] // Fields to search in
          }
        });

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Search failed');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>
            {searchQuery 
              ? `Search Results for: "${decodeURIComponent(searchQuery)}"` 
              : 'Search Products'
            }
          </h2>
          
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : products.length > 0 ? (
            <Row>
              {products.map((product) => (
                <Col
                  key={product._id}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3"
                >
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          ) : searchQuery ? (
            <Message variant="info">
              No products found matching "{decodeURIComponent(searchQuery)}"
            </Message>
          ) : (
            <Message variant="info">Enter a search term above</Message>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchScreen;