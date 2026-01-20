require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const Plant = require('./models/plant')

const app = express()

// ===== Middleware =====
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static('public'))

// ===== MongoDB (Atlas-ready) =====
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed')
    console.error(err)
    process.exit(1)
  }
}
connectDB()

// ===== Test Route =====
app.get('/test', (req, res) => {
  res.send('Server is working ✅')
})

// ===== Root Redirect =====
app.get('/', (req, res) => {
  res.redirect('/plants')
})

// ===== INDEX =====
app.get('/plants', async (req, res) => {
  const plants = await Plant.find()
  res.render('plants/index', { plants })
})

// ===== NEW =====
app.get('/plants/new', (req, res) => {
  res.render('plants/new')
})

// ===== CREATE =====
app.post('/plants', async (req, res) => {
  const plant = await Plant.create(req.body)
  res.redirect(`/plants/${plant._id}`)
})

// ===== SHOW =====
app.get('/plants/:id', async (req, res) => {
  const plant = await Plant.findById(req.params.id)
  res.render('plants/show', { plant })
})

// ===== EDIT =====
app.get('/plants/:id/edit', async (req, res) => {
  const plant = await Plant.findById(req.params.id)
  res.render('plants/edit', { plant })
})

// ===== UPDATE =====
app.put('/plants/:id', async (req, res) => {
  await Plant.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/plants/${req.params.id}`)
})

// ===== DELETE =====
app.delete('/plants/:id', async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id)
  res.redirect('/plants')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
)
