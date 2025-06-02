// Import React library to use JSX and component features
import React from 'react';
// Import Container, Row, and Col components from react-bootstrap for layout structure
import { Container, Row, Col } from 'react-bootstrap';
// Import Link component from react-router-dom for navigation links
import { Link } from 'react-router-dom';
// Import social media icons from react-icons library
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
// Import FontAwesomeIcon component for custom icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import a specific icon (faKipSign) from FontAwesome's free solid icons
import { faKipSign } from '@fortawesome/free-solid-svg-icons';

// Define the Footer functional component
const Footer = () => {
  // Return the JSX structure for the footer
  return (
    // Main footer element with a custom background class
    <footer className="footer-bg">
      {/* Bootstrap container for responsive layout */}
      <Container>
        {/* Bootstrap row to organize columns horizontally */}
        <Row>
          {/* First column: Logo and description */}
          <Col md={4}>
            <h5>
              {/* Display the custom icon with animation and color */}
              <FontAwesomeIcon
                icon={faKipSign}
                beat
                style={{ color: '#0d6efd' }}
              />
              {/* Brand name */}
              radiancy
            </h5>
            {/* Short description about the shop */}
            <p>Your Trusted Source For Authentic Korean Skincare Products.</p>
          </Col>
          {/* Second column: Quick navigation links */}
          <Col md={4}>
            <h5>Quick Links</h5>
            {/* Unordered list for navigation links */}
            <ul className="list-unstyled">
              <li>
                {/* Link to the "Who Are We?" page */}
                <Link to="/shop">Who Are We ?</Link>
              </li>
              <li>
                {/* Link to the "Brands" page */}
                <Link to="/brands">Brands</Link>
              </li>
            </ul>
          </Col>
          {/* Third column: Contact information and social icons */}
          <Col md={4}>
            <h5>Contact</h5>
            {/* Email contact info */}
            <p>Email: K-radiancySupport@gmail.com</p>
            {/* Phone contact info */}
            <p>Phone: +216 25 4980 56</p>
            {/* Social media icons with links */}
            <div className="social-icons gap-3 mt-2">
              {/* Facebook icon link */}
              <Link href="#" aria-label="Facebook" className="text-dark fs-5 ">
                <FaFacebookF />
              </Link>
              {/* Instagram icon link */}
              <Link href="#" aria-label="Instagram" className="text-dark fs-5">
                <FaInstagram />
              </Link>
              {/* Twitter icon link */}
              <Link href="#" aria-label="Twitter" className="text-dark fs-5">
                <FaTwitter />
              </Link>
            </div>
          </Col>
        </Row>
        {/* Copyright notice centered at the bottom */}
        <p className="text-center mt-2 mb-0">
          &copy; {new Date().getFullYear()}{' '}
          {/* Brand icon with animation and color */}
          <FontAwesomeIcon icon={faKipSign} beat style={{ color: '#0d6efd' }} />
          radiancy. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

// Export the Footer component as default
export default Footer;