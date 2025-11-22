import React from 'react';
import PageHeader from './PageHeader';
import "./assets/css/style.css";
import "./styles/css/admin.css";
import { WOW } from 'wowjs';
import { useEffect, useState } from 'react';
import axios from "axios";
import tncBackground from './assets/img/hero/upload.jpg';

const UploadRow1 = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageLink, setImageLink] = useState(""); // New state for image link
    const [images, setImages] = useState([]);
    const [imageCount, setImageCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [imageToEdit, setImageToEdit] = useState(null);
    const [imageIndexToEdit, setImageIndexToEdit] = useState(null);
    const [isLinkMode, setIsLinkMode] = useState(false); // Toggle for file or link mode

    useEffect(() => {
        // Fetch the current images and image count for Row 1
        fetchImages();
      }, [])

    useEffect(() => {
        const wow = new WOW({ live: false });
        wow.init();
    }, []);

    const fetchImages = () => {
        axios
        .get("/api/images/row1")
        .then((response) => {
            setImages(response.data);
            setImageCount(response.data.length);
        })
        .catch(() => {
            // Silently ignore errors - API might not be available
            setImages([]);
            setImageCount(0);
        });
    };

 // Validate image dimensions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;

        if (width < 500 || height < 500 || width > 1600 || height > 2500) {
          setErrorMessage(
            "Image dimensions must be between 500px x 500px and 1600px x 2500px."
          );
          setSelectedFile(null); // Reset file selection
        } else if (width > height) {
          setErrorMessage("Width cannot exceed the height.");
          setSelectedFile(null); // Reset file selection
        } else {
          setSelectedFile(file);
          setErrorMessage(""); // Clear any previous error messages
          setUploadMessage("");
        }
      };
    }
  };

  const handleLinkChange = (e) => {
    setImageLink(e.target.value);
    setErrorMessage("");
    setUploadMessage("");
    setSelectedFile(null); // Clear file selection if the link is being uploaded
  };

  // Check if the provided link is a valid image
  const validateImageLink = async (url) => {
    try {
      // Use a proxy or head request to avoid CORS issues when checking the image
      const res = await axios({
        method: "GET",
        url,
        responseType: "blob", // Ensures the response is treated as a binary file
      });
  
      const contentType = res.data.type; // Get the content type from the blob
      return contentType.startsWith("image/"); // Check if the URL is an image
    } catch (error) {
      return false; // If an error occurs, return false
    }
  };
  const handleUpload = async () => {
    try {
      if (imageCount >= 15) {
        setErrorMessage("Maximum of 15 images allowed for Row 1.");
        return;
      }
  
      let formData;
  
      if (isLinkMode) {
        // Case 1: Handle image link upload
        if (!imageLink) {
          setErrorMessage("Please enter an image link.");
          return;
        }
  
        const isValidLink = await validateImageLink(imageLink);
        if (!isValidLink) {
          setErrorMessage("Invalid image link. Please provide a direct link to an image.");
          return;
        }
  
        formData = { link: imageLink }; // Set the link in the formData
      } else {
        // Case 2: Handle file upload
        if (!selectedFile) {
          setErrorMessage("Please select a file to upload.");
          return;
        }
  
        formData = new FormData();
        formData.append("image", selectedFile); // Append the selected file to the formData
      }
  
      // Common API request for both link and file upload
      await axios.post("/api/upload/row1", formData, {
        headers: isLinkMode ? {} : { "Content-Type": "multipart/form-data" }, // Only set content type for file uploads
      });
  
      setUploadMessage(
        isLinkMode ? "Image link uploaded successfully!" : "Image uploaded successfully!"
      );
      fetchImages(); // Refresh images after upload
  
      // Clear inputs after successful upload
      setSelectedFile(null);
      setImageLink("");
    } catch (err) {
      console.error(err);
      setErrorMessage(isLinkMode ? "Error uploading image link." : "Error uploading image.");
    }
  };
  

  const handleDelete = (imageId) => {
    axios
      .delete(`/api/images/row1/${imageId}`)
      .then(() => {
        setUploadMessage("Image deleted successfully!");
        fetchImages(); // Refresh images after delete
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Error deleting image.");
      });
  };

  const handleEdit = (imageId, index) => {
    setEditMode(true);
    setImageToEdit(imageId);
    setImageIndexToEdit(index);
    setSelectedFile(null); // Reset the file input when switching to edit mode
    setImageLink(""); // Reset the link input when switching to edit mode
  };

  const handleUpdate = () => {
    if (!imageToEdit || imageIndexToEdit === null) {
      setErrorMessage("No image selected for updating.");
      return;
    }
  
    let formData;
  
    if (isLinkMode) {
      // Handle link update
      if (!imageLink) {
        setErrorMessage("Please enter a valid image link to update.");
        return;
      }
  
      formData = { link: imageLink }; // Set the link in formData
    } else {
      // Handle file update
      if (!selectedFile) {
        setErrorMessage("Please select a new file to update.");
        return;
      }
  
      formData = new FormData();
      formData.append("image", selectedFile); // Append file to formData
    }
  
    // Make a single PUT request to handle both file and link updates
    axios
      .put(`/api/images/row1/${imageToEdit}`, formData, {
        headers: isLinkMode ? {} : { "Content-Type": "multipart/form-data" }, // Set header for file upload
      })
      .then(() => {
        setUploadMessage(
          isLinkMode ? "Image link updated successfully!" : "Image updated successfully!"
        );
  
        // Update the images array with the new link or file
        const updatedImages = [...images];
        updatedImages[imageIndexToEdit].filename = isLinkMode ? imageLink : selectedFile.name;
        setImages(updatedImages); // Update the image in the same position
  
        // Clear inputs and exit edit mode
        setImageLink("");
        setSelectedFile(null);
        setEditMode(false);
        setImageToEdit(null);
        setImageIndexToEdit(null);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(isLinkMode ? "Error updating image link." : "Error updating image.");
      });
  };
  

  return (
    <div className="black-bg">
  
        {/* Hero Start */}
        <PageHeader title="UPLOAD" sliderAreaClass="slider-area3" backgroundImage={tncBackground}/>
        {/* Hero End */}

        {/* Courses Area Start */}
        <main>
        <section className="">
          <div className="pricing-area">
            <div className="properties__card wow fadeInUp "data-wow-duration="2s" data-wow-delay=".4s">
              <div className="">
                    <h2 className="center-white"> Upload, Edit, or Delete Image for Row 1</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {uploadMessage && <p style={{ color: "green" }}>{uploadMessage}</p>}
                <p className="center-white2 ">{`Images uploaded: ${imageCount}/15`}</p>

                {/* Toggle between file and link upload */}
                <div className="radio-group">
                    <label className="radio-label"> 
                    <input
                        type="radio"
                        checked={!isLinkMode}
                        onChange={() => setIsLinkMode(false)}
                        className="radio-input"
                    />
                         <span className="radio-text">Upload File</span>
                    </label>

                    <label className="radio-label">
                    <input
                        type="radio"
                        checked={isLinkMode}
                        onChange={() => setIsLinkMode(true)}
                         className="radio-input"
                    />
                    <span className="radio-text">Upload via Link</span>
                    </label>
                </div>

                {!isLinkMode ? (
                    <>
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="file-input"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // Hide the default input
                            />
                            <label htmlFor="file-input" className="choose-file-btn">
                                {selectedFile ? selectedFile.name : 'Choose File'}
                            </label>
                        </div>
                        {selectedFile && <span>{selectedFile.name}</span>}
                    </>
                ) : (
                    <>
                        <div className="link-upload-container">
                            <input
                                type="text"
                                value={imageLink}
                                onChange={handleLinkChange}
                                placeholder="Enter image link"
                                className="link-input"
                            />
                        </div>
                    </>
                )}

                <br />
                {!editMode ? (
                    <button
                        className="file-upload-button"
                        onClick={handleUpload}
                        disabled={!selectedFile && !imageLink} // Disabled when no file or link
                    >
                        Upload Image
                    </button>
                ) : (
                    <button
                        className="file-upload-button"
                        onClick={handleUpdate}
                        disabled={!selectedFile && !imageLink} // Disabled when no file or link
                    >
                        Update Image
                    </button>
                )}

                <h3 className="center-white">Uploaded Images</h3>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {images.map((image, index) => (
                    <div
                        key={image.id}
                        style={{
                        border: "1px solid white",
                        margin: "10px",
                        padding: "10px",
                        textAlign: "center",
                        }}
                    >
                        <img
                        src={image.filename.startsWith("http") ? image.filename : `/uploads/${image.filename}`}
                        alt={image.filename}
                        style={{ width: "100px", height: "100px" }}
                        />
                        <br />
                        <button
                        onClick={() => handleEdit(image.id, index)}
                        disabled={editMode && imageToEdit === image.id}
                        style={{
                            backgroundColor:
                            editMode && imageToEdit === image.id ? "green" : 
                             !editMode ? "blue" : "white",width: "40px" // Blue when not clicked, green when clicked, white when disabled
                        }}
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDelete(image.id)}
                        style={{ backgroundColor: "red",  width: "60px"}}
                        
                        >
                        Delete
                        </button>
                    </div>
                    ))}
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UploadRow1;
