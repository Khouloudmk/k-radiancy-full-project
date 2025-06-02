// Import React library to use JSX and component features
import React from 'react';
// Import Row component from react-bootstrap for layout
import Row from 'react-bootstrap/Row';
// Import Col component from react-bootstrap for layout columns
import Col from 'react-bootstrap/Col';

// Define the CheckoutSteps functional component, receiving props as argument
export default function CheckoutSteps(props) {
  // Render a Row containing four columns, each representing a checkout step
  return (
    <Row className="checkout-steps">
      {/* If step1 prop is true, add 'active' class to highlight the step */}
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      {/* If step2 prop is true, add 'active' class to highlight the step */}
      <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
      {/* If step3 prop is true, add 'active' class to highlight the step */}
      <Col className={props.step3 ? 'active' : ''}>Payment</Col>
      {/* If step4 prop is true, add 'active' class to highlight the step */}
      <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}