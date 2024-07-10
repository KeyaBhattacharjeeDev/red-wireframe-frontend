import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mermaid from 'mermaid';

function MyComponent() {  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mermaidCode, setMermaidCode] = useState('');

  const handleSubmit = async (event) => {

    event.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Indicate loading state
    setErrorMessage(null); // Clear any previous error message

    try {
      const fullPrompt = `${prompt} and convert it to Mermaid JS code. Return only the code. Mermaid version 8.10.1`;
      const payload = { prompt: fullPrompt }; // Create request body with prompt
      const response = await axios.post('http://localhost:5000/text', payload);      
      const responseText = response.data.text;      
      const formattedText = responseText.replace(/```mermaid|```/g, '').trim();      
      setMermaidCode(formattedText); // Set formatted mermaid code
      
    } catch (error) {
      console.error('Error fetching data:', error); // Log error for debugging
      setErrorMessage('An error occurred while processing your request.'); // Set user-friendly error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    if (mermaidCode) {
      // Initialize Mermaid to render diagrams
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }
  }, [mermaidCode]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:<br/>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            required
            style={{ color: "red", width: "400px", height: "100px" }}
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Generate'}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      {mermaidCode && <div className="mermaid">{mermaidCode}</div>} {/* Display mermaid code */}
    </>
  );  
}

export default MyComponent;
