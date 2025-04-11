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
    setCertifications((prev) =>
      checked ? [...prev, value] : prev.filter((cert) => cert !== value)
    );
  };

  const uploadFileHandler = (e) => {
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

    if (!image || !name || !description || !price || !stock || !category) {
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

      // Reset form
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
    <div className="container mx-auto px-6 py-12 bg-gradient-to-b from-white to-green-50 min-h-screen">
      <div className="max-w-5xl mx-auto shadow-2xl rounded-2xl p-10 bg-white">
        <h2 className="text-4xl font-extrabold text-greenPalette-darkGreen text-center mb-10">
          Add a New Product 
        </h2>

        {/* Image Upload Section */}
        <div className="mb-10">
          <label className="block text-xl font-semibold text-greenPalette-deepGreen mb-3">
            Product Image
          </label>
          <div
            className={`relative flex items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
              image
                ? "border-greenPalette-deepGreen bg-green-50"
                : "border-mutedPalette-dustyMauve bg-mutedPalette-lavenderMist"
            }`}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="product preview"
                className="w-40 h-40 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-center text-mutedPalette-dustyMauve">
                <FiUpload size={48} className="mx-auto mb-2" />
                <p className="text-sm">Drag & drop or click to upload</p>
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

        {/* Divider */}
        <div className="border-t border-gray-300 my-10"></div>

        {/* Category Selection */}
        <div className="mb-10">
          <label className="block text-xl font-semibold text-greenPalette-deepGreen mb-4">
            Select Category
          </label>
          {categoriesLoading ? (
            <p className="text-mutedPalette-dustyMauve">Loading categories...</p>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => setCategory(cat._id)}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                    category === cat._id
                      ? "border-greenPalette-deepGreen ring-2 ring-greenPalette-deepGreen"
                      : "border-mutedPalette-dustyMauve"
                  }`}
                >
                  <img
                    src={`http://localhost:5001${cat.image}`}
                    alt={cat.name}
                    className="w-full h-28 object-cover"
                  />
                  <div
                    className={`p-3 text-center font-medium ${
                      category === cat._id
                        ? "text-greenPalette-darkGreen bg-green-50"
                        : "text-mutedPalette-dustyMauve bg-white"
                    }`}
                  >
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-mutedPalette-dustyMauve">No categories available.</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-10"></div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen focus:border-greenPalette-deepGreen"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen focus:border-greenPalette-deepGreen"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen focus:border-greenPalette-deepGreen"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <label className="block text-lg font-medium text-greenPalette-deepGreen mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-greenPalette-darkGreen focus:ring-2 focus:ring-greenPalette-deepGreen focus:border-greenPalette-deepGreen"
            rows="4"
          ></textarea>
        </div>

        {/* Certifications */}
        <div className="mb-10">
          <label className="block text-xl font-semibold text-greenPalette-deepGreen mb-4">
            Certifications
          </label>
          <div className="flex flex-wrap gap-4">
            {["Fair Trade Certified", "Organic", "Carbon Neutral"].map((cert) => (
              <label
                key={cert}
                className={`flex items-center space-x-3 px-4 py-2 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                  certifications.includes(cert)
                    ? "bg-green-50 border-greenPalette-deepGreen text-greenPalette-darkGreen"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  value={cert}
                  onChange={handleCertificationChange}
                  checked={certifications.includes(cert)}
                  className="form-checkbox text-greenPalette-deepGreen focus:ring-greenPalette-darkGreen"
                />
                <span className="text-sm">{cert}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 text-lg font-bold text-white bg-greenPalette-darkGreen rounded-xl hover:bg-greenPalette-deepGreen focus:outline-none focus:ring-2 focus:ring-greenPalette-darkGreen transition-all duration-300"
        >
          Add Product 
        </button>
      </div>
    </div>
  );
};

export default ProductList;