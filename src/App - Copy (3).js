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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setResults(null);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">BRS Property Flipping Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize">{key.replace(/_/g, ' ')} (£)</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>
      <div className="mt-6">
        {results && (
          <div className="space-y-2">
            <p><strong>Acquisition Cost:</strong> £{results.acquisition_cost}</p>
            <p><strong>Total Cost:</strong> £{results.total_cost}</p>
            <p><strong>Gross Profit:</strong> £{results.gross_profit}</p>
            <p><strong>Profit Margin:</strong> {results.profit_margin}%</p>
          </div>
        )}
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
}
