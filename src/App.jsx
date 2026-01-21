import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

function App() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Uniforms',
    size: '',
    stock: 0
  })
  const [editedStocks, setEditedStocks] = useState({})

  const categories = ['All', 'Uniforms', 'Books']
  
  const getSubcategories = (category) => {
    if (category === 'All') return []
    const categoryProducts = products.filter(p => p.category === category)
    const subcategories = [...new Set(categoryProducts.map(p => p.name))]
    return subcategories.sort()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        if (data.length === 0) {
          await initializeDatabase()
          const newResponse = await fetch(`${API_URL}/products`)
          if (newResponse.ok) {
            const newData = await newResponse.json()
            setProducts(newData)
          }
        } else {
          setProducts(data)
        }
      } else {
        let errorMessage = 'Failed to load products. Please check if the server is running.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = `Server Error: ${errorData.error}`;
            if (errorData.details) {
              errorMessage += ` (${errorData.details})`;
            }
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Cannot connect to server. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    try {
      await fetch(`${API_URL}/products/initialize`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }

  const resetDatabase = async () => {
    if (window.confirm('Are you sure you want to reset the database? This will delete all existing products and load the default products.')) {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/products/reset`, {
          method: 'POST'
        })
        if (response.ok) {
          await fetchProducts()
          alert('Database reset successfully!')
        } else {
          alert('Error resetting database. Please try again.')
        }
      } catch (error) {
        console.error('Error resetting database:', error)
        alert('Error resetting database. Please check if the server is running.')
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredProducts = () => {
    let filtered = products
    
    if (selectedCategory !== 'All') {
      if (selectedSubcategory) {
        filtered = filtered.filter(p => p.category === selectedCategory && p.name === selectedSubcategory)
      } else {
        filtered = filtered.filter(p => p.category === selectedCategory)
      }
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.size.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  const increaseStock = async (id) => {
    const product = products.find(p => p._id === id)
    if (!product) return

    const newStock = product.stock + 1
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: newStock })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p._id === id ? updatedProduct : p))
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const decreaseStock = async (id) => {
    const product = products.find(p => p._id === id)
    if (!product || product.stock === 0) return

    const newStock = product.stock - 1
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: newStock })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p._id === id ? updatedProduct : p))
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const updateStock = async (id, value) => {
    const n = Math.max(0, parseInt(value))
    if (Number.isNaN(n)) return
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: n })
      })
      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p._id === id ? updatedProduct : p))
        setEditedStocks(prev => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const handleStockInputChange = (id, v) => {
    const filtered = v.replace(/[^\d]/g, '')
    setEditedStocks(prev => ({ ...prev, [id]: filtered }))
  }

  const handleStockInputKeyDown = (id, e) => {
    if (e.key === 'Enter') {
      updateStock(id, editedStocks[id] ?? '')
    }
    if (e.key === 'Escape') {
      setEditedStocks(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      e.currentTarget.blur()
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      if (!newProduct.name.trim() || !newProduct.size.trim()) {
        alert('Please fill in all required fields')
        return
      }
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      })

      if (response.ok) {
        const savedProduct = await response.json()
        setProducts([...products, savedProduct])
        setShowAddForm(false)
        setNewProduct({ name: '', category: 'Uniforms', size: '', stock: 0 })
        alert('Product added successfully!')
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to add product'}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product. Please check if the server is running.')
    }
  }

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      setSelectedCategory('All')
      setSelectedSubcategory(null)
      setExpandedCategory(null)
    } else {
      setSelectedCategory(category)
      setSelectedSubcategory(null)
      if (expandedCategory === category) {
        setExpandedCategory(null)
      } else {
        setExpandedCategory(category)
      }
    }
    // Close mobile menu when a category is selected (optional, depends on UX preference)
    // setIsMobileMenuOpen(false) 
  }

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory)
    setIsMobileMenuOpen(false) // Close menu on selection
  }

  return (
    <div className="app">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Categories</h2>
          <button className="close-sidebar-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
        </div>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category}>
              <div 
                className={`category-item ${selectedCategory === category && !selectedSubcategory ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
                {category !== 'All' && getSubcategories(category).length > 0 && (
                  <span className="expand-icon">
                    {expandedCategory === category ? '▼' : '▶'}
                  </span>
                )}
              </div>
              {expandedCategory === category && category !== 'All' && (
                <ul className="subcategory-list">
                  <li
                    className={selectedCategory === category && selectedSubcategory === null ? 'active' : ''}
                    onClick={() => handleSubcategoryClick(null)}
                  >
                    All {category}
                  </li>
                  {getSubcategories(category).map(subcat => (
                    <li
                      key={subcat}
                      className={selectedSubcategory === subcat ? 'active' : ''}
                      onClick={() => handleSubcategoryClick(subcat)}
                    >
                      {subcat}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="main-content">
        <div className="header-container">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>
          <h1>Podar Stock Manager</h1>
          <div className="header-actions">
            <button 
              className="btn-add"
              onClick={() => setShowAddForm(true)}
            >
              + Add Item
            </button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name, size, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Item</h2>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Item Name (e.g., Shirt, Skirt, Tie, Belt):</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                    placeholder="Enter item name"
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    <option value="Uniforms">Uniforms</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Size/Class:</label>
                  <input
                    type="text"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                    required
                    placeholder="Enter size or class"
                  />
                </div>
                <div className="form-group">
                  <label>Initial Stock:</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">Add Item</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            Loading products...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#e74c3c' }}>
            <p>{error}</p>
            <button 
              onClick={fetchProducts}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : filteredProducts().length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            No products found.
          </div>
        ) : (
          <div className="products-container">
            {filteredProducts().map(product => (
              <div key={product._id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="size-info">
                    {product.category === 'Uniforms' ? 'Size' : 'Class'}: {product.size}
                  </p>
                  <p className="stock">Stock: {product.stock}</p>
                </div>
                <div className="stock-controls">
                  <button 
                    className="btn-decrease" 
                    onClick={() => decreaseStock(product._id)}
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <input
                    className="stock-input"
                    type="number"
                    min="0"
                    value={editedStocks[product._id] !== undefined ? editedStocks[product._id] : String(product.stock)}
                    onChange={(e) => handleStockInputChange(product._id, e.target.value)}
                    onBlur={() => updateStock(product._id, editedStocks[product._id] ?? product.stock)}
                    onKeyDown={(e) => handleStockInputKeyDown(product._id, e)}
                  />
                  <button 
                    className="btn-increase" 
                    onClick={() => increaseStock(product._id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
