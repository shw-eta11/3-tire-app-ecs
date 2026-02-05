import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages`)
      .then(res => setMessages(res.data.messages))
      .catch(() => setMessages('Error fetching message'));

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
      setNewMessage('');
      setSelectedCategory('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>3-Tier React + Node + MySQL App</h1>
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
        <div className="messages">
        <h2>All Messages</h2>

        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <ul>
            {messages.map(msg => (
              <li key={msg.id}>
                <strong>{msg.category}</strong> : {msg.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      </header>
    </div>
  );
}

export default App;
