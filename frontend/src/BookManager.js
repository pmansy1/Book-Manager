import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🚨 IMPORTANT: Change this to the K8s internal service name for deployment!
// The internal name is the name of the Kubernetes Service for your Spring API (e.g., 'book-api-service').
// This is critical for the "Configure the React app to call the Kubernetes Service endpoint" requirement.
// For port-forwarding setup, always use localhost:8080
// This works for both development and the current Kubernetes setup
const API_BASE_URL = 'http://localhost:8080';

function BookManager() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', ISBN: '' });
  
  const [updateBook, setUpdateBook] = useState({ id: null, title: '', ISBN: '' });

  // READ (GET) - Fetch all books
  const fetchBooks = async () => {
    try {
     
      const response = await axios.get(`${API_BASE_URL}/view`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books (Is Spring API running & K8s Service Name correct?):', error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle input changes for the Add Book form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };
  
  //  Handle input changes for the Update Book form
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateBook(prev => ({ ...prev, [name]: value }));
  };

  // 2. CREATE (POST) - Add a new book
  const addBook = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('title', newBook.title);
    params.append('isbn', newBook.ISBN);

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      alert(response.data);
      setNewBook({ title: '', ISBN: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Check API connection/CORS.');
    }
  };

  // 🆕 NEW: 4. UPDATE (PUT) - Update a book's title
  const submitUpdate = async (e) => {
    e.preventDefault();
    
    // Spring endpoint: /update/{id}?title=newTitle
    const url = `${API_BASE_URL}/update/${updateBook.id}?title=${updateBook.title}`;

    try {
      const response = await axios.put(url);
      alert(response.data);
      // Clear update state and refresh the list
      setUpdateBook({ id: null, title: '', ISBN: '' }); 
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book.');
    }
  };

  // Helper function to load selected book into update form
  const loadForUpdate = (book) => {
    setUpdateBook({ id: book.id, title: book.title, ISBN: book.isbn });
  };

  // 3. DELETE (DELETE) - Delete a book by ID (no change needed)
  const deleteBook = async (id) => {
    if (!window.confirm(`Are you sure you want to delete book ID: ${id}?`)) { return; }
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      alert(response.data);
      fetchBooks();
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
        <input type="text" name="title" placeholder="Title (String)" value={newBook.title} onChange={handleInputChange} required style={inputStyle} />
        <input type="number" name="ISBN" placeholder="ISBN (Integer)" value={newBook.ISBN} onChange={handleInputChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle.create}>Add Book</button>
      </form>
      
      {/* UPDATE BOOK FORM (UPDATE) */}
      {updateBook.id && (
        <div style={updateContainerStyle}>
            <h3>Update Book ID: {updateBook.id}</h3>
            <form onSubmit={submitUpdate} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="New Title" 
                    value={updateBook.title} 
                    onChange={handleUpdateChange} 
                    required 
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle.update}>Update Title</button>
                <button type="button" onClick={() => setUpdateBook({ id: null, title: '', ISBN: '' })} style={buttonStyle.cancel}>Cancel</button>
            </form>
        </div>
      )}

      {/* BOOK LIST (READ) */}
      <h2>Current Books</h2>
      <table style={tableStyle.table}>
          <thead>
            <tr style={tableStyle.headerRow}>
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
                <td style={tableCellStyle}>{book.isbn}</td>
                <td style={tableCellStyle}>
                  {/* UPDATE BUTTON */}
                  <button onClick={() => loadForUpdate(book)} style={buttonStyle.updateSmall}>Update</button>
                  {/* DELETE BUTTON */}
                  <button onClick={() => deleteBook(book.id)} style={buttonStyle.deleteSmall}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
}

// Simple styling definitions
const inputStyle = { padding: '8px', border: '1px solid #ccc' };
const buttonStyle = {
    create: { padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' },
    update: { padding: '8px 15px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' },
    cancel: { padding: '8px 15px', background: '#9E9E9E', color: 'white', border: 'none', cursor: 'pointer' },
    updateSmall: { padding: '5px 8px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer', marginRight: '5px' },
    deleteSmall: { padding: '5px 8px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }
};
const tableStyle = {
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    headerRow: { background: '#f2f2f2' }
};
const tableHeaderStyle = { padding: '10px', border: '1px solid #ddd', textAlign: 'left' };
const tableCellStyle = { padding: '10px', border: '1px solid #ddd' };
const updateContainerStyle = { padding: '15px', border: '1px solid #ccc', marginBottom: '30px', background: '#e3f2fd' };

export default BookManager;