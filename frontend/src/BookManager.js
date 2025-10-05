import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming your Spring Boot API is running on this base URL
const API_BASE_URL = 'http://localhost:8080';

function BookManager() {
  // State for the list of books
  const [books, setBooks] = useState([]);
  
  // State for the new book form inputs
  // 🔄 CHANGE 1: ID field REMOVED from the state
  const [newBook, setNewBook] = useState({ title: '', ISBN: '' });

  // 1. READ (GET) - Fetch all books on component load and any time the dependency array changes
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/view`);
      // Assuming your Spring API returns an array of Book objects
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); // Empty dependency array means this runs once after the initial render

  // Handle input changes for the new book form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  // 2. CREATE (POST) - Add a new book
  const addBook = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // 🔄 CHANGE 2: ID parameter REMOVED from the URLSearchParams
    const params = new URLSearchParams();
    params.append('title', newBook.title);
    params.append('ISBN', newBook.ISBN);

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      alert(response.data); // Show the success message from your Spring controller
      
      // 🔄 CHANGE 3: Clear the form state, only resetting title and ISBN
      setNewBook({ title: '', ISBN: '' }); 
      fetchBooks(); // Refresh the list of books
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Check your Spring service logs.');
    }
  };

  // 3. DELETE (DELETE) - Delete a book by ID (No change needed here)
  const deleteBook = async (id) => {
    if (!window.confirm(`Are you sure you want to delete book with ID: ${id}?`)) {
        return;
    }
    try {
      // Your Spring API uses a path variable: /delete/{id}
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      alert(response.data); // Show the success message from your Spring controller
      fetchBooks(); // Refresh the list of books
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Book Manager 📚</h1>
      
      {/* ADD BOOK FORM (CREATE) */}
      <h2>Add New Book</h2>
      <form onSubmit={addBook} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {/* 🔄 CHANGE 4: ID input field REMOVED from the JSX */}
        
        <input 
          type="text" 
          name="title" 
          placeholder="Title (String)" 
          value={newBook.title} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <input 
          type="number" 
          name="ISBN" 
          placeholder="ISBN (Integer)" 
          value={newBook.ISBN} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Book
        </button>
      </form>

      {/* BOOK LIST (READ) - No changes needed here, as the table still displays the ID returned by the service */}
      <h2>Current Books</h2>
      {books.length === 0 ? (
        <p>No books found. Add one!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>ISBN</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td style={tableCellStyle}>{book.id}</td>
                <td style={tableCellStyle}>{book.title}</td>
                <td style={tableCellStyle}>{book.ISBN}</td>
                <td style={tableCellStyle}>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => deleteBook(book.id)}
                    style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Simple styling for the table for better readability
const tableHeaderStyle = { padding: '10px', border: '1px solid #ddd', textAlign: 'left' };
const tableCellStyle = { padding: '10px', border: '1px solid #ddd' };

export default BookManager;