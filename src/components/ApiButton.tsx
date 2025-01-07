'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const ApiButton = () => {
  // State to manage loading and response
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the API call
  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your API endpoint
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      
      setResponse(data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button 
        onClick={handleClick}
        disabled={isLoading}
        className="w-32"
      >
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </Button>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

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
