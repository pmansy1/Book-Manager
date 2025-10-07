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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📚 Book Manager</h1>
        <p style={subtitleStyle}>Manage your digital library with ease</p>
      </div>
      
      {/* ADD BOOK FORM (CREATE) */}
      <div style={cardStyle} className="card-hover">
        <h2 style={sectionTitleStyle}>✨ Add New Book</h2>
        <form onSubmit={addBook} style={formStyle}>
          <div style={inputGroupStyle}>
            <input 
              type="text" 
              name="title" 
              placeholder="Enter book title..." 
              value={newBook.title} 
              onChange={handleInputChange} 
              required 
              style={inputStyle} 
            />
            <input 
              type="number" 
              name="ISBN" 
              placeholder="Enter ISBN number..." 
              value={newBook.ISBN} 
              onChange={handleInputChange} 
              required 
              style={inputStyle} 
            />
          </div>
          <button type="submit" style={buttonStyle.create}>
            <span>➕ Add Book</span>
          </button>
        </form>
      </div>
      
      {/* UPDATE BOOK FORM (UPDATE) */}
      {updateBook.id && (
        <div style={updateCardStyle}>
          <h3 style={updateTitleStyle}>✏️ Update Book ID: {updateBook.id}</h3>
          <form onSubmit={submitUpdate} style={formStyle}>
            <input 
              type="text" 
              name="title" 
              placeholder="Enter new title..." 
              value={updateBook.title} 
              onChange={handleUpdateChange} 
              required 
              style={inputStyle}
            />
            <div style={buttonGroupStyle}>
              <button type="submit" style={buttonStyle.update}>
                <span>💾 Save Changes</span>
              </button>
              <button 
                type="button" 
                onClick={() => setUpdateBook({ id: null, title: '', ISBN: '' })} 
                style={buttonStyle.cancel}
              >
                <span>❌ Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOOK LIST (READ) */}
      <div style={cardStyle} className="card-hover">
        <h2 style={sectionTitleStyle}>📖 Current Books ({books.length})</h2>
        {books.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>📚</div>
            <p style={emptyTextStyle}>No books in your library yet</p>
            <p style={emptySubtextStyle}>Add your first book to get started!</p>
          </div>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Title</th>
                  <th style={tableHeaderStyle}>ISBN</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id} style={{...tableRowStyle, animationDelay: `${index * 0.1}s`}}>
                    <td style={tableCellStyle}>
                      <span style={idBadgeStyle}>{book.id}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={titleTextStyle}>{book.title}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={isbnTextStyle}>{book.isbn || 'N/A'}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={actionButtonGroupStyle}>
                        <button 
                          onClick={() => loadForUpdate(book)} 
                          style={buttonStyle.updateSmall}
                          title="Edit this book"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteBook(book.id)} 
                          style={buttonStyle.deleteSmall}
                          title="Delete this book"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern styling definitions with animations and shadows
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '40px',
  animation: 'fadeInDown 0.8s ease-out'
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: '700',
  color: 'white',
  margin: '0 0 10px 0',
  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const subtitleStyle = {
  fontSize: '1.2rem',
  color: 'rgba(255,255,255,0.9)',
  margin: '0',
  fontWeight: '300'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '30px',
  marginBottom: '30px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
  border: '1px solid rgba(255,255,255,0.3)',
  animation: 'slideInUp 0.6s ease-out',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 20px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px'
};

const inputStyle = {
  padding: '15px 20px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  background: 'white',
  transition: 'all 0.3s ease',
  outline: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const buttonStyle = {
  create: {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)',
    alignSelf: 'flex-start'
  },
  update: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #4299e1, #3182ce)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)'
  },
  cancel: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #a0aec0, #718096)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(160, 174, 192, 0.3)'
  },
  updateSmall: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #4299e1, #3182ce)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(66, 153, 225, 0.3)',
    marginRight: '8px'
  },
  deleteSmall: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #f56565, #e53e3e)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(245, 101, 101, 0.3)'
  }
};

const updateCardStyle = {
  ...cardStyle,
  background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(49, 130, 206, 0.1))',
  border: '2px solid rgba(66, 153, 225, 0.2)',
  animation: 'slideInLeft 0.5s ease-out'
};

const updateTitleStyle = {
  ...sectionTitleStyle,
  color: '#2b6cb0'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '15px',
  alignSelf: 'flex-start'
};

const tableContainerStyle = {
  overflow: 'hidden',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  background: 'white',
  borderRadius: '15px',
  overflow: 'hidden'
};

const tableHeaderStyle = {
  padding: '20px 15px',
  background: 'linear-gradient(135deg, #4a5568, #2d3748)',
  color: 'white',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableRowStyle = {
  animation: 'fadeInUp 0.5s ease-out forwards',
  opacity: '0',
  transform: 'translateY(20px)'
};

const tableCellStyle = {
  padding: '20px 15px',
  borderBottom: '1px solid #e2e8f0',
  background: 'white',
  transition: 'background-color 0.2s ease'
};

const idBadgeStyle = {
  display: 'inline-block',
  padding: '6px 12px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  minWidth: '30px',
  textAlign: 'center'
};

const titleTextStyle = {
  fontWeight: '600',
  color: '#2d3748',
  fontSize: '1rem'
};

const isbnTextStyle = {
  color: '#718096',
  fontFamily: 'monospace',
  fontSize: '0.9rem'
};

const actionButtonGroupStyle = {
  display: 'flex',
  gap: '8px'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#718096'
};

const emptyIconStyle = {
  fontSize: '4rem',
  marginBottom: '20px',
  opacity: '0.5'
};

const emptyTextStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  margin: '0 0 10px 0',
  color: '#4a5568'
};

const emptySubtextStyle = {
  fontSize: '1rem',
  margin: '0',
  opacity: '0.7'
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    transform: translateY(-2px);
  }
  
  button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
  }
  
  button:active {
    transform: translateY(0) !important;
  }
  
  tr:hover td {
    background-color: #f7fafc !important;
  }
  
  .card-hover:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
  }
`;

document.head.appendChild(style);

export default BookManager;