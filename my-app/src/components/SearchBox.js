import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    // If called from button click without event (e.g., onAccessibilityClick)
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Trim whitespace and encode URI component
    const searchQuery = query.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    
    // Navigate to search page with query parameter
    navigate(`/search?query=${encodedQuery}`);
    
    // Clear the search input after submission if desired
    setQuery('');
  };

  // Handle pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitHandler(e);
    }
  };

  return (
    <Form className="d-flex me-auto px-3" onSubmit={submitHandler}>
      <InputGroup className="search-box">
        <FormControl
          type="text"
          name="q"
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        />
        <Button 
          className="bg-primary" 
          type="submit" 
          id="button-search"
          onClick={submitHandler}  // Added onClick handler
          aria-label="Search"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            beat
            style={{ color: '#ffffff' }}
          />
        </Button>
      </InputGroup>
    </Form>
  );
}