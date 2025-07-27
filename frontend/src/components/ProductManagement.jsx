import React, { useEffect, useState } from 'react';
import { FiEdit2, FiSearch, FiPlus } from 'react-icons/fi';
import '../pages/Dashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/products/myproducts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <span>Price (₹)</span> {/* updated label */}
          <span>Image</span>
        </div>

        {filteredProducts.map(product => (
          <div className="table-row" key={product._id}>
            <span>{product._id.slice(0, 6).toUpperCase()}</span>
            <span>{product.name}</span>
            <span>{product.availableQuantity} {product.unit}</span>
            <span>₹{product.pricePerUnit}</span> {/* use price instead of description */}
            <span>
              <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
            </span>
          </div>
        ))}
      </div>

      <button className="fab-add-button" title="Add New Product">
        <FiPlus />
      </button>
    </main>
  );
};

export default ProductManagement;
