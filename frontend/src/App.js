import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch messages
    axios.get(`/api/messages`)
      .then(res => {
        if (Array.isArray(res.data?.messages)) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch(err => {
        console.error("Messages fetch failed:", err);
        setMessages([]);
      });

    // Fetch categories and remove duplicates
    axios.get(`/api/categories`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const uniqueCategories = Array.from(
            new Map(res.data.map(cat => [cat.name, cat])).values()
          );
          setCategories(uniqueCategories);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error("Categories fetch failed:", err);
        setCategories([]);
      });
  }, []);

  const handleAddMessage = () => {
    if (!newMessage || !selectedCategory) {
      alert('Enter message and select category');
      return;
    }

    axios.post(`/api/message`, {
      message: newMessage,
      category: selectedCategory
    })
    .then(() => axios.get(`/api/messages`))
    .then(res => {
      if (Array.isArray(res.data?.messages)) {
        setMessages(res.data.messages);
      } else {
        setMessages([]);
      }
      setNewMessage('');
      setSelectedCategory('');
    })
    .catch(err => {
      console.error("Add message failed:", err);
    });
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

          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) &&
              categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            }
          </select>

          <button onClick={handleAddMessage}>
            Add Message
          </button>
        </div>

        <div className="messages">
          <h2>All Messages</h2>

          {!Array.isArray(messages) || messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Message</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id}>
                    <td>{msg.id}</td>
                    <td>{msg.category}</td>
                    <td>{msg.message}</td>
                    <td>{msg.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </header>
    </div>
  );
}

export default App;
