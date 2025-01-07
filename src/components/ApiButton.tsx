'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ApiButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleClick = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a value');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.example.com/data?query=${inputValue}`);
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
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your search..."
        />
        
        <Button 
          onClick={handleClick}
          disabled={isLoading}
          className="w-32"
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </Button>
      </div>

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
