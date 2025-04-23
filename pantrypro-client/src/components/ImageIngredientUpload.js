import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ImageIngredientUpload.css';

const ImageIngredientUpload = ({ onIngredientsRecognized }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (png, jpg, jpeg)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5001/api/recognize-ingredients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.ingredients) {
        onIngredientsRecognized(response.data.ingredients);
      } else {
        setError('No ingredients were recognized in the image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.error || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="image-upload-container">
      <h3>Recognize Ingredients from an Image</h3>
      <p className="upload-description">
        Take a photo of your ingredients and we'll identify them for you!
      </p>

      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button className="clear-button" onClick={clearImage}>
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="upload-icon">📷</div>
            <p>Drag & drop an image here or click to browse</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        className="recognize-button"
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
      >
        {loading ? 'Recognizing...' : 'Recognize Ingredients'}
      </button>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing your image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageIngredientUpload;
