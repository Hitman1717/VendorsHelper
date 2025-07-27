import React, { useState } from 'react';
import { FiEdit2, FiSearch, FiPlus } from 'react-icons/fi';
import '../pages/Dashboard.css'; // We'll add new styles to this file
import { Link } from 'react-router-dom';

// Dummy data based on your design
const productsData = [
  {
    id: '002',
    name: 'Cashews',
    quantity: '10kg',
    description: 'Premium quality whole cashews.',
    imageUrl: 'https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,h_450,q_auto,w_710/f_auto/healthiest-nuts-phpuOEIm3' // Using the image you provided
  },
  // Add more products here
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="main-content product-management-page">
      <div className="product-header">
        <h2>Product management</h2>
        <div className="header-actions">
          <button className="icon-button"><FiEdit2 /></button>
          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="search your product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="product-table">
        <div className="table-header">
          <span>Product id</span>
          <span>Product name</span>
          <span>Quantity / units</span>
          <span>Description</span>
          <span>Image</span>
        </div>
        {productsData.map(product => (
          <div className="table-row" key={product.id}>
            <span>{product.id}</span>
            <span>{product.name}</span>
            <span>{product.quantity}</span>
            <span>{product.description}</span>
            <span><img src={product.imageUrl} alt={product.name} className="product-thumbnail" /></span>
          </div>
        ))}
      </div>

      {/* Floating Action Button to add a new product */}
      <button className="fab-add-button" title="Add New Product">
        <FiPlus />
      </button>
    </main>
  );
};

export default ProductManagement;