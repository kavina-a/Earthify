import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetch product data
  const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(params._id);
  console.log("Product Data:", productData);

  // Fetch categories
  const { data: categories } = useFetchCategoriesQuery();

  // State for the form fields
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [certifications, setCertifications] = useState([]);

  const [updateProduct] = useUpdateProductMutation();

  // Populate state when productData is available
  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setStock(productData.countInStock || "");
      setCategory(productData.category || "");
      setImage(null); 
      setCertifications(productData.certifications || []);
    }
  }, [productData]);

  console.log("Certifications:", productData?.certifications);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !description || !price || !stock || !category) {
      toast.error("Please fill in all fields");
      return;
    }
  
    try {
      // Create FormData instance
      const formData = new FormData();
  
      // Add the image if it exists
      if (image) {
        formData.append("image", image); // New image
      } else if (productData.image) {
        formData.append("existingImage", productData.image); // Existing image
      }
  
      // Add other fields to FormData
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("countInStock", stock); // Ensure field name matches backend
      formData.append("category", category);
      formData.append("certifications", JSON.stringify(certifications));
  
      // Debugging FormData content
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  
      // Send the FormData to the backend
      const response = await updateProduct({ productId: params._id, formData }).unwrap();
      console.log("Product update response:", response);
  
      if (response && response.message) {
        toast.success(response.message);
        // navigate("/products");
      } else {
        toast.error("Product update failed");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Product update failed");
    }
  };

  const handleCertificationChange = (e) => {
    const { value, checked } = e.target;
  
    // If checked, add it to certifications; if unchecked, remove it
    if (checked) {
      setCertifications((prevCertifications) => [
        ...prevCertifications,
        value,
      ]);
    } else {
      setCertifications((prevCertifications) =>
        prevCertifications.filter((cert) => cert !== value)
      );
    }
  };
  
  useEffect(() => {
    // If product is available, parse certifications from string to array
    if (productData && productData.certifications) {
      const parsedCertifications = JSON.parse(productData.certifications);
      setCertifications(parsedCertifications || []);
    }
  }, [productData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error?.message || "Something went wrong"}</div>;

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">

          <h2 className="h-12">Update Product</h2>
          {productData && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {/* Show the uploaded image preview or image name */}
              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(image)} // Display preview of the uploaded image
                    alt="Preview"
                    className="max-w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <span>{image.name}</span>
                </div>
              ) : (
                productData.image ? (
                  <div className="flex flex-col items-center">
                    <img
                        src={`http://localhost:5001${productData.image}`}  // Prepend the base URL to the relative path stored in DB
                        alt="Uploaded Image"
                      className="max-w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <span>Current Image</span>
                  </div>
                ) : (
                  "Upload Image"
                )
              )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>

              <div className="p-3">
                <div className="flex flex-wrap">
                  <div>
                    <label htmlFor="name">Name</label>
                     <br />
                    <input
                      type="text"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="ml-10">
                    <label htmlFor="price">Price</label> <br />
                    <input
                      type="number"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div>
                    <label htmlFor="quantity">Quantity</label> <br />
                    <input
                      type="number"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <label htmlFor="description" className="my-5">
                  Description
                </label>
                <textarea
                  className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                      <div>
                          <label>Certifications</label>
                          <div>
                            {["Fair Trade Certified", "Organic", "Carbon Neutral"].map((cert) => (
                              <label key={cert}>
                                <input
                                  type="checkbox"
                                  value={cert}
                                  onChange={handleCertificationChange}
                                  checked={certifications.includes(cert)} // Check if this certification exists in the array
                                />
                                {cert}
                              </label>
                            ))}
                          </div>
                        </div>
                <button
                  type="submit"
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
                >
                  Update
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;