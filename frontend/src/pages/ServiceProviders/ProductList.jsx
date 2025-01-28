import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import { FiUpload } from "react-icons/fi";

const ProductList = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [certifications, setCertifications] = useState([]);

  const { data: categories, isLoading: categoriesLoading } = useFetchCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  const handleCertificationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCertifications([...certifications, value]);
    } else {
      setCertifications(certifications.filter((cert) => cert !== value));
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    setImage(file);
    toast.success(`File ${file.name} selected successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Image is required");
      return;
    }

    if (!name || !description || !price || !stock || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("countInStock", stock);
      formData.append("certifications", JSON.stringify(certifications));

      const response = await createProduct(formData).unwrap();
      toast.success(response.message || "Product created successfully!");
      setImage(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCertifications([]);
      setCategory("");
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className=" shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-greenPalette-darkGreen text-center mb-8">Add a New Product</h2>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Product Image</label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 relative flex items-center justify-center ${
              image ? "border-greenPalette-deepGreen" : "border-mutedPalette-dustyMauve"
            }`}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="product preview"
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="text-center text-mutedPalette-dustyMauve">
                <FiUpload size={48} className="mx-auto mb-2" />
                <p className="text-sm">Drag and drop or click to upload</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={uploadFileHandler}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Select Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoriesLoading ? (
            <p className="text-mutedPalette-dustyMauve">Loading categories...</p>
          ) : categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setCategory(cat._id)}
                className={`cursor-pointer rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-all ${
                  category === cat._id
                    ? "border-greenPalette-deepGreen"
                    : "border-mutedPalette-dustyMauve"
                }`}
              >
                <img
                  src={`http://localhost:5001${cat.image}`}
                  alt={cat.name}
                  className="w-full h-24 object-cover"
                />
                <div
                  className={`p-2 text-center font-medium ${
                    category === cat._id ? "text-greenPalette-darkGreen" : "text-mutedPalette-dustyMauve"
                  }`}
                >
                  {cat.name}
                </div>
              </div>
            ))
          ) : (
            <p className="text-mutedPalette-dustyMauve">No categories available.</p>
          )}
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-mutedPalette-dustyMauve rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full px-4 py-3 border border-mutedPalette-dustyMauve rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="block w-full px-4 py-3 border border-mutedPalette-dustyMauve rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-3 border border-mutedPalette-dustyMauve rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen"
            rows="4"
          ></textarea>
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">Certifications</label>
          <div className="grid grid-cols-3 gap-4">
            {["Fair Trade Certified", "Organic", "Carbon Neutral"].map((cert) => (
              <label key={cert} className="flex items-center space-x-3 text-greenPalette-darkGreen">
                <input
                  type="checkbox"
                  value={cert}
                  onChange={handleCertificationChange}
                  className="form-checkbox text-greenPalette-deepGreen focus:ring-greenPalette-darkGreen"
                />
                <span>{cert}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 text-lg font-semibold text-white bg-greenPalette-darkGreen rounded-lg hover:bg-greenPalette-deepGreen focus:outline-none focus:ring-2 focus:ring-greenPalette-darkGreen"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductList;

// import { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   useCreateProductMutation,
// } from "../../redux/api/productsApiSlice";
// import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
// import { useNavigate } from "react-router-dom";

// const ProductList = () => {
//   const [image, setImage] = useState(null);
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [category, setCategory] = useState('');
//   const [stock, setStock] = useState('');
//   const [certifications, setCertifications] = useState([]);

//   const navigate = useNavigate();
//   const { data: categories, isLoading, isError, error } = useFetchCategoriesQuery();

//   const [createProduct] = useCreateProductMutation();

//   const handleCertificationChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setCertifications([...certifications, value]);
//     } else {
//       setCertifications(certifications.filter((cert) => cert !== value));
//     }
//   };

//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     if (!file) {
//       toast.error("No file selected");
//       return;
//     }

//     setImage(file); // Store the file object when selected
//     toast.success(`File ${file.name} selected successfully`);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!image) {
//       toast.error("Image is required");
//       return;
//     }
  
//     if (!name || !description || !price || !stock || !category) {
//       toast.error("Please fill in all fields");
//       return;
//     }
  
//     try {
//       const formData = new FormData();
//       formData.append("image", image);
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("category", category);
//       formData.append("countInStock", stock);
//       formData.append("certifications", JSON.stringify(certifications)); 
      
//       // Make the API call
//       const response = await createProduct(formData).unwrap();
  
//       // Log the response to debug
//       console.log('API Response:', response);
  
//       if (response && response.message) {
//         toast.success(response.message);
//         // navigate("/products");
//       } else {
//         toast.error("Product creation failed");
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error("Product creation failed");
//     }
//   };

//   return (
//     <div className="container xl:mx-[9rem] sm:mx-[0]">
//       <div className="flex flex-col md:flex-row">
//         <div className="md:w-3/4 p-3">
//           <div className="h-12">Create Product</div>

//           {image && (
//             <div className="text-center">
//               <img
//                 src={URL.createObjectURL(image)} // Display the uploaded image before submitting
//                 alt="product"
//                 className="block mx-auto max-h-[200px]"
//               />
//             </div>
//           )}

//           <div className="mb-3">
//             <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
//               {image ? image.name : "Upload Image"}
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 onChange={uploadFileHandler}
//                 className={!image ? "hidden" : "text-white"}
//               />
//             </label>
//           </div>

//           <div className="p-3">
//             <div className="flex flex-wrap">
//               <div className="one">
//                 <label htmlFor="name">Name</label> <br />
//                 <input
//                   type="text"
//                   className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               <div className="two ml-10">
//                 <label htmlFor="price">Price</label> <br />
//                 <input
//                   type="number"
//                   className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-wrap">
//               <div className="one">
//                 <label htmlFor="quantity">Quantity</label> <br />
//                 <input
//                   type="number"
//                   className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
//                   value={stock}
//                   onChange={(e) => setStock(e.target.value)}
//                 />
//               </div>
//             </div>

//             <label htmlFor="description" className="my-5">
//               Description
//             </label>
//             <textarea
//               type="text"
//               className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>

//             <div className="flex justify-between">
//               <div>
//                 <label htmlFor="category">Category</label> <br />
//                 <select
//                   placeholder="Choose Category"
//                   className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
//                   onChange={(e) => setCategory(e.target.value)}
//                 >
//                   {categories?.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//                 <label>Certifications</label>
//                 <div>
//                   <label>
//                     <input
//                       type="checkbox"
//                       value="Fair Trade Certified"
//                       onChange={handleCertificationChange}
//                     />
//                     Fair Trade Certified
//                   </label>
//                   <label>
//                     <input
//                       type="checkbox"
//                       value="Organic"
//                       onChange={handleCertificationChange}
//                     />
//                     Organic
//                   </label>
//                   <label>
//                     <input
//                       type="checkbox"
//                       value="Carbon Neutral"
//                       onChange={handleCertificationChange}
//                     />
//                     Carbon Neutral
//                   </label>
//                 </div>
//               </div>

//             <button
//               onClick={handleSubmit}
//               className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;