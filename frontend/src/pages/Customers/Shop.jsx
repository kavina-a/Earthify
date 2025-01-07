import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../../redux/api/productsApiSlice';
import { setCategories, setProducts, setChecked } from '../../redux/features/shop/shopSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import NavBar from "../Auth/Navigation";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    if (categoriesQuery.isSuccess && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery, dispatch]);

  useEffect(() => {
    if (filteredProductsQuery.isSuccess) {
      const filteredProducts = filteredProductsQuery.data.filter((product) =>
        product.price.toString().includes(priceFilter) ||
        product.price === parseInt(priceFilter, 10)
      );
      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="">

      <NavBar />

          {/* Catchy Header Section */}
          <div className="p-6 bg-mutedPalette-mutedBlue text-center w-screen shadow-lg ">
      <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce">
        Find What You Love, Love What You Find ❤️
      </h1>
    </div>

      <div className="container mx-auto ml-[2%] md:ml-[3%]">


<div className='w-screen'>
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="mb-6"
>
  <video
    src="/images/store.mp4"  // Path to your video
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
        <label className="text-sm text-mutedPalette-dustyMauve">{c.name}</label>
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
              visible: { opacity: 1, scale: 1, transition: { delay: 0.2, staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {products.length === 0 ? (
              <p className="text-center text-mutedPalette-dustyMauve">Loading products...</p>
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

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useGetFilteredProductsQuery } from '../../redux/api/productsApiSlice';
// import { setCategories, setProducts, setChecked } from '../../redux/features/shop/shopSlice';
// import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
// import ProductCard from './ProductCard';

// const Shop = () => {
//   const dispatch = useDispatch();
//   const { categories, products, checked, radio } = useSelector((state) => state.shop);

//   const categoriesQuery = useFetchCategoriesQuery();
//   const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });
//   console.log('Filtered Products Query:', filteredProductsQuery);

//   const [priceFilter, setPriceFilter] = useState('');

//   // Debugging logs for API queries
//   console.log('Categories Query:', categoriesQuery);
//   console.log('Filtered Products Query:', filteredProductsQuery);

//   useEffect(() => {
//     if (categoriesQuery.isSuccess && categoriesQuery.data) {
//       console.log('Fetched Categories:', categoriesQuery.data);
//       dispatch(setCategories(categoriesQuery.data));
//     } else if (categoriesQuery.isError) {
//       console.error('Error fetching categories:', categoriesQuery.error);
//     }
//   }, [categoriesQuery, dispatch]);

//   useEffect(() => {
//     if (!checked.length || !radio.length) {
//       if (!filteredProductsQuery.isLoading) {
//         console.log('Fetched Products:', filteredProductsQuery.data);
//         // Filter products based on both checked categories and price filter
//         const filteredProducts = filteredProductsQuery.data.filter(
          
//           (product) => {
//             // Check if the product price includes the entered price filter value
//             return (
//               product.price.toString().includes(priceFilter) ||
//               product.price === parseInt(priceFilter, 10)
//             );
            
//           }
//         );
//         console.log('Filtered Products by Price:', filteredProducts);
//         dispatch(setProducts(filteredProducts));
//       }
//     }
//   }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

//   const handleCheck = (value, id) => {
//     const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
//     console.log('Updated Checked Categories:', updatedChecked);
//     dispatch(setChecked(updatedChecked));
//   };

//   const handlePriceChange = (e) => {
//     const price = e.target.value;
//     console.log('Updated Price Filter:', price);
//     setPriceFilter(price);
//   };

// return (
//     <>
//       <div className="container mx-auto">
//         <div className="flex md:flex-row">
//           <div className="bg-[#151515] p-3 mt-2 mb-2">
//             <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
//               Filter by Categories
//             </h2>

//             <div className="p-5 w-[15rem]">
//               {categories?.map((c) => (
//                 <div key={c._id} className="mb-2">
//                   <div className="flex ietms-center mr-4">
//                     <input
//                       type="checkbox"
//                       id="red-checkbox"
//                       onChange={(e) => handleCheck(e.target.checked, c._id)}
//                       className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     />

//                     <label
//                       htmlFor="pink-checkbox"
//                       className="ml-2 text-sm font-medium text-white dark:text-gray-300"
//                     >
//                       {c.name}
//                     </label>
//                   </div>
//                 </div>
//               ))}
//             </div>


//             <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
//               Filer by Price
//             </h2>

//             <div className="p-5 w-[15rem]">
//               <input
//                 type="text"
//                 placeholder="Enter Price"
//                 value={priceFilter}
//                 onChange={handlePriceChange}
//                 className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
//               />
//             </div>

//             <div className="p-5 pt-0">
//               <button
//                 className="w-full border my-4"
//                 onClick={() => window.location.reload()}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           <div className="p-3">
//             <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
//             <div className="flex flex-wrap">
//               {products.length === 0 ? (
//                 <h1>loading</h1>
//               ) : (
//                 products?.map((p) => (
//                   <div className="p-3" key={p._id}>
//                     <ProductCard p={p} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Shop


