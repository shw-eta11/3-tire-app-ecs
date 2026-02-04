import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message`)
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Error fetching message'));

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddMessage = () => {
    if(!newMessage || !selectedCategory) return alert('Enter message and select category');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/message`, {
      message: newMessage,
      category: selectedCategory
    })
    .then(res => {
      setMessage(res.data.message);
      setNewMessage('');
      setSelectedCategory('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>3-Tier React + Node + MySQL App</h1>
        <p>{message}</p>

        <div className="form">
          <input 
            type="text" 
            placeholder="New Message" 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
          />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button onClick={handleAddMessage}>Add Message</button>
        </div>
      </header>
    </div>
  );
}

export default App;
