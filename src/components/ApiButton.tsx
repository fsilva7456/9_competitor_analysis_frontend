'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ApiButton = () => {
  // State management for component
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Handler for the API call
  const handleClick = async () => {
    // Input validation
    if (!inputValue.trim()) {
      setError('Please enter a value');
      return;
    }

    // Set loading state and clear any previous errors
    setIsLoading(true);
    setError(null);
    
    try {
      // POST request configuration
      const response = await fetch('https://api.example.com/data', {
        // Specify the HTTP method as POST
        method: 'POST',
        // Set headers to indicate we're sending JSON
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert our data to JSON string for the request body
        body: JSON.stringify({
          brand_name: inputValue
        })
      });

      // Parse the JSON response
      const data = await response.json();
      
      // Update state with the response data
      setResponse(data);
    } catch (err) {
      // Handle any errors that occur during the request
      setError('Failed to fetch data');
    } finally {
      // Reset loading state whether the request succeeded or failed
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-2">
        {/* Input field for user data */}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your search..."
        />
        
        {/* Submit button with loading state */}
        <Button 
          onClick={handleClick}
          disabled={isLoading}
          className="w-32"
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </Button>
      </div>

      {/* Error message display */}
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Response data display */}
      {response && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiButton;
