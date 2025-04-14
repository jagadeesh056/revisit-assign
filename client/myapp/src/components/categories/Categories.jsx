import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import AddCategoryForm from './AddCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import Modal from '../common/Modal';
import '../../styles/categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', newCategory.name);
      formData.append('itemCount', newCategory.itemCount);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }
      
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      
      const data = await response.json();
      setCategories([...categories, data]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', updatedCategory.name);
      formData.append('itemCount', updatedCategory.itemCount);
      if (updatedCategory.image && typeof updatedCategory.image !== 'string') {
        formData.append('image', updatedCategory.image);
      }
      
      const response = await fetch(`http://localhost:5000/api/categories/${currentCategory._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      const data = await response.json();
      
      setCategories(categories.map(cat => 
        cat._id === currentCategory._id ? data : cat
      ));
      
      setShowEditModal(false);
      setCurrentCategory(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
  };

  if (loading && categories.length === 0) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Categories</h1>
        <button 
          className="add-category-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add Category
        </button>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <CategoryCard 
            key={category._id} 
            category={category} 
            onEdit={() => openEditModal(category)}
          />
        ))}
      </div>
      
      {/* Add Category Modal */}
      <Modal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
      >
        <AddCategoryForm onSubmit={handleAddCategory} />
      </Modal>
      
      {/* Edit Category Modal */}
      <Modal 
        show={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Category"
      >
        {currentCategory && (
          <EditCategoryForm 
            category={currentCategory} 
            onSubmit={handleEditCategory} 
          />
        )}
      </Modal>
    </div>
  );
}

export default Categories;