import React, { useState } from 'react';
import '../../styles/categories.css';

function EditCategoryForm({ category, onSubmit }) {
  const [formData, setFormData] = useState({
    name: category.name || '',
    itemCount: category.itemCount || '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(category.imageUrl || '');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (!formData.itemCount || isNaN(formData.itemCount)) {
      setError('Item count must be a valid number');
      return;
    }
    
    // Submit form with existing category ID
    onSubmit({
      ...formData,
      _id: category._id
    });
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Summer Clothes"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="itemCount">Item Count</label>
        <input
          type="number"
          id="itemCount"
          name="itemCount"
          value={formData.itemCount}
          onChange={handleChange}
          placeholder="e.g. 26"
          required
          min="0"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="image">Category Image</label>
        <div className="image-upload-container">
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="image-upload-input"
          />
          <label htmlFor="image" className="image-upload-label">
            {imagePreview ? (
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <i className="upload-icon"></i>
                <span>Click to upload image</span>
              </div>
            )}
          </label>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Update Category
        </button>
      </div>
    </form>
  );
}

export default EditCategoryForm;