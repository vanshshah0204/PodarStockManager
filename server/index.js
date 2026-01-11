import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/podarstock'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

const defaultProducts = [
  { name: 'Boys Shirt', category: 'Uniforms', size: '2', stock: 15 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '4', stock: 20 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '6', stock: 18 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '8', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '10', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '12', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '14', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '16', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '18', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '20', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '22', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '24', stock: 12 },
  { name: 'Boys Shirt', category: 'Uniforms', size: '26', stock: 12 },
  { name: 'Trouser', category: 'Uniforms', size: '2', stock: 10 },
  { name: 'Trouser', category: 'Uniforms', size: '4', stock: 22 },
  { name: 'Trouser', category: 'Uniforms', size: '6', stock: 16 },
  { name: 'Trouser', category: 'Uniforms', size: '8', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '10', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '14', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '16', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '18', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '20', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '22', stock: 14 },
  { name: 'Trouser', category: 'Uniforms', size: '24', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '2', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '4', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '6', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '8', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '10', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '14', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '16', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '18', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '20', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '22', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '24', stock: 14 },
  { name: 'Girl Shirt', category: 'Uniforms', size: '26', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '2', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '4', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '6', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '8', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '10', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '14', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '16', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '18', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '20', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '22', stock: 14 },
  { name: 'Girl Skirt', category: 'Uniforms', size: '24', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '2', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '4', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '6', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '8', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '10', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '14', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '16', stock: 14 },
  { name: 'Sports T-Shirt', category: 'Uniforms', size: '18', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '2', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '4', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '6', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '8', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '10', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '14', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '16', stock: 14 },
  { name: 'Sports Trackpant', category: 'Uniforms', size: '18', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: 'XS', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: 'S', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: 'M', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: 'L', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: 'XL', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: '2XL', stock: 14 },
  { name: 'Jerkin', category: 'Uniforms', size: '3XL', stock: 14 },
  { name: 'Tie', category: 'Uniforms', size: '12', stock: 14 },
  { name: 'Tie', category: 'Uniforms', size: '15', stock: 14 },
  { name: 'Tie', category: 'Uniforms', size: '48', stock: 14 },
  { name: 'Tie', category: 'Uniforms', size: '52', stock: 14 },
  { name: 'Stocking', category: 'Uniforms', size: '32', stock: 14 },
  { name: 'Stocking', category: 'Uniforms', size: '36', stock: 14 },
  { name: 'Stocking', category: 'Uniforms', size: '40', stock: 14 },
  { name: 'Stocking', category: 'Uniforms', size: '28', stock: 14 },
  { name: 'Belt', category: 'Uniforms', size: '26', stock: 14 },
  { name: 'Belt', category: 'Uniforms', size: '30', stock: 14 },
  { name: 'Belt', category: 'Uniforms', size: '36', stock: 14 },
  { name: 'Belt', category: 'Uniforms', size: '44', stock: 14 },
  { name: 'Belt', category: 'Uniforms', size: '52', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '26', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '28', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '30', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '32', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '34', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '36', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '38', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '40', stock: 14 },
  { name: 'Legging', category: 'Uniforms', size: '42', stock: 14 },
  { name: 'Socks', category: 'Uniforms', size: '4', stock: 14 },
  { name: 'Socks', category: 'Uniforms', size: '5', stock: 14 },
  { name: 'Socks', category: 'Uniforms', size: '6', stock: 14 },
  { name: 'Socks', category: 'Uniforms', size: '8', stock: 14 },
]

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { stock } = req.body
    
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    )
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, size, stock } = req.body
    
    if (!name || !category || !size || stock === undefined) {
      return res.status(400).json({ error: 'Name, category, size, and stock are required' })
    }
    
    const product = new Product({
      name,
      category,
      size,
      stock: parseInt(stock) || 0
    })
    
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products/reset', async (req, res) => {
  try {
    await Product.deleteMany({})
    await Product.insertMany(defaultProducts)
    res.json({ message: 'Database reset successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products/initialize', async (req, res) => {
  try {
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(defaultProducts)
      res.json({ message: 'Database initialized with default products' })
    } else {
      res.json({ message: 'Database already initialized' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app
