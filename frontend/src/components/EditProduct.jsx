import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import '../pages/Dashboard.css'; // Uses the same stylesheet

// This is a mock function. In a real app, you would fetch this data from your API.
const fetchProductById = (id) => {
    console.log("Fetching data for product ID:", id);
    return {
        id: '002',
        name: 'Cashews',
        quantity: '10kg',
        description: 'Premium quality whole cashews, sourced from the best farms. Perfect for snacking and cooking.',
        imageUrl: 'http://googleusercontent.com/file_content/4'
    };
};

const EditProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Gets the product ID from the URL, e.g., /edit/002

    const [productData, setProductData] = useState({
        id: '',
        name: '',
        quantity: '',
        description: '',
    });
    const [productImage, setProductImage] = useState(null);

    // In a real app, you'd fetch data when the component loads
    useEffect(() => {
        const existingProduct = fetchProductById(productId);
        setProductData(existingProduct);
    }, [productId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProductImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would send the updated data to your server
        console.log("Saving product:", { ...productData, productImage });
        alert("Product saved successfully!");
        navigate('/dashboard/products'); // Go back to the product list after saving
    };

    return (
        <main className="main-content edit-product-page">
            <header className="edit-product-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FiArrowLeft />
                </button>
                <h2>Product management</h2>
            </header>

            <form onSubmit={handleSubmit} className="edit-product-form">
                <input
                    type="text"
                    name="id"
                    placeholder="Product id"
                    value={productData.id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="quantity"
                    placeholder="Quantity (units/kgs/litres)"
                    value={productData.quantity}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    rows="5"
                    value={productData.description}
                    onChange={handleChange}
                />

                <label htmlFor="image-upload" className="image-upload-box">
                    <FiCamera />
                    <span>Upload your product image</span>
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} hidden />

                <button type="submit" className="save-button">Save</button>
            </form>
        </main>
    );
};

export default EditProduct;