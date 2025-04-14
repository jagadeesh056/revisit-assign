const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single category
router.get('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new category
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, itemCount } = req.body;
    
    if (!name || !itemCount) {
      return res.status(400).json({ message: 'Name and item count are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const category = new Category({
      name,
      itemCount,
      imageUrl,
      createdBy: req.user._id
    });
    
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, itemCount } = req.body;
    
    if (!name || !itemCount) {
      return res.status(400).json({ message: 'Name and item count are required' });
    }
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user is the creator of the category
    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }
    
    // Update fields
    category.name = name;
    category.itemCount = itemCount;
    category.updatedAt = Date.now();
    
    // Update image if provided
    if (req.file) {
      // Delete old image if it exists
      if (category.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', category.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      category.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await category.save();
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user is the creator of the category
    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }
    
    // Delete image if it exists
    if (category.imageUrl) {
      const imagePath = path.join(__dirname, '..', category.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await category.remove();
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;