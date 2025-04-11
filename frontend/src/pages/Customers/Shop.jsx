import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productsApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import NavBar from "../Auth/Navigation";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (categoriesQuery.isSuccess && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery, dispatch]);

  useEffect(() => {
    if (filteredProductsQuery.isSuccess) {
      const filteredProducts = filteredProductsQuery.data.filter(
        (product) =>
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
      );
      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="">
      <NavBar />

      <div className="container mx-auto ml-[2%] md:ml-[3%]">
        <div className="w-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <video
              src="/images/store.mp4" // Path to your video
              autoPlay
              loop
              muted
              playsInline
              className="w-[100%] h-[550px] object-cover"
            >
              {/* Fallback text */}
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Sidebar Filters */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-mutedPalette- p-6 rounded-lg shadow-lg w-full md:w-1/4 ml-[5%] mt-[2%]"
          >
            <h2 className="text-lg font-bold text-mutedPalette-mutedBlue mb-4">
              Filter by Categories
            </h2>
            <div className="space-y-3">
              {categories?.map((c) => (
                <div key={c._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-5 h-5 text-mutedPalette-mutedBlue border-mutedPalette-dustyMauve rounded focus:ring-mutedPalette-mutedBlue"
                  />
                  <label className="text-sm text-mutedPalette-dustyMauve">
                    {c.name}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-mutedPalette-mutedBlue mt-6 mb-4">
              Filter by Price
            </h2>
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mutedPalette-mutedBlue focus:border-mutedPalette-mutedBlue"
            />

            <button
              onClick={() => window.location.reload()}
              className="w-full mt-6 px-4 py-2 text-white bg-mutedPalette-mutedBlue hover:bg-mutedPalette-dustyMauve rounded-lg shadow-lg transition duration-300"
            >
              Reset Filters
            </button>
          </motion.div>

          {/* Products Section */}
          <div className="flex-1">
            <motion.h2
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-xl font-bold text-mutedPalette-mutedBlue mb-4 mt-[4%] ml-[5%]"
            >
              {products?.length || 0} Products Found
            </motion.h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.2, staggerChildren: 0.2 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {products.length === 0 ? (
                <p className="text-center text-mutedPalette-dustyMauve">
                  Loading products...
                </p>
              ) : (
                products.map((p) => (
                  <motion.div
                    key={p._id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="shadow-lg rounded-lg overflow-hidden bg-mutedPalette-beige"
                  >
                    <ProductCard p={p} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
