import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    purchase_price: '',
    stamp_duty: '',
    legal_fees: '',
    agent_fees_buy: '',
    renovation_costs: '',
    resale_price: '',
    selling_costs: ''
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // New state for validation errors

  // Helper function to validate a single field
  const validateField = (name, value) => {
    let message = '';
    const numValue = parseFloat(value); // Convert to number for checks

    if (value.trim() === '') {
      message = 'This field cannot be empty.';
    } else if (isNaN(numValue)) {
      message = 'Must be a valid number.';
    } else if (numValue < 0) {
      message = 'Must be a non-negative number.';
    }
    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field as it changes
    const errorMessage = validateField(name, value);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));
  };

  // Comprehensive validation for all fields before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const errorMessage = validateField(key, value);
      if (errorMessage) {
        newErrors[key] = errorMessage;
        isValid = false;
      }
    });

    setValidationErrors(newErrors); // Update all errors at once
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null); // Clear previous results on new submission

    // Run form validation before submission
    const formIsValid = validateForm();
    if (!formIsValid) {
      setError('Please correct the errors in the form.');
      return; // Stop submission if validation fails
    }

    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Ensure data is parsed to numbers before sending to backend
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, parseFloat(value || '0')])
          )
        )
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong on the server.');
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          BRS Property Flipping Calculator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="relative group">
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 capitalize mb-1"
                >
                  {key.replace(/_/g, ' ')} (£)
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  // Removed 'required' as our custom validation handles emptiness
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200
                              ${validationErrors[key] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                  placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                />
                {/* Display validation error message */}
                {validationErrors[key] && (
                  <p className="text-red-500 text-xs italic mt-1">{validationErrors[key]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate
          </button>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          {results && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Calculation Results:</h2>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="flex justify-between items-center text-lg text-gray-800">
                  <span className="font-medium">Acquisition Cost:</span>
                  <span className="font-bold text-blue-700">£{results.acquisition_cost}</span>
                </p>
                <p className="flex justify-between items-center text-lg text-gray-800">
                  <span className="font-medium">Total Cost:</span>
                  <span className="font-bold text-blue-700">£{results.total_cost}</span>
                </p>
                <p className="flex justify-between items-center text-lg text-gray-800">
                  <span className="font-medium">Gross Profit:</span>
                  <span className="font-bold text-green-600">£{results.gross_profit}</span>
                </p>
                <p className="flex justify-between items-center text-lg text-gray-800">
                  <span className="font-medium">Profit Margin:</span>
                  <span className="font-bold text-green-600">{results.profit_margin}%</span>
                </p>
              </div>
            </div>
          )}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-md mt-4 border border-red-300">
              **Error:** {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}