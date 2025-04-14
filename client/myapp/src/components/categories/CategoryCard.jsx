import React from 'react';
import '../../styles/categories.css';

function CategoryCard({ category, onEdit }) {
  return (
    <div className="category-card">
      <div className="category-image-container">
        <img 
          src={category.imageUrl || '/placeholder.jpg'} 
          alt={category.name} 
          className="category-image" 
        />
        <button className="edit-button" onClick={onEdit}>
          <i className="edit-icon"></i>
          Edit
        </button>
      </div>
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-count">{category.itemCount} items</p>
      </div>
    </div>
  );
}

export default CategoryCard;