import React, { useState, useEffect } from "react";
import NavBar from "../Auth/Navigation";
import {
  useEcoPointsQuery,
  useCurrentProfileQuery,
} from "../../redux/api/usersApiSlice";
import {
  useGetTopSellingCategoriesQuery,
  useGetTopSellingProductsQuery,
} from "../../redux/api/orderApiSlice";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const slides = [
    { url: "/images/home1.png", title: "Beautiful Nature" },
    { url: "/images/home2.png", title: "Majestic Mountains" },
    { url: "/images/home3.png", title: "Serene Waterfalls" },
    { url: "/images/home4.png", title: "Lush Forest" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: ecoPointsData, isLoading: ecoPointsLoading, error: ecoPointsError } = useEcoPointsQuery();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useCurrentProfileQuery();
  const { data: topCategories, isLoading: topCategoriesLoading, error: topCategoriesError } = useGetTopSellingCategoriesQuery();
  const { data: topProducts, isLoading: topProductsLoading, error: topProductsError } = useGetTopSellingProductsQuery();
  console.log(topProducts)
  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <div className="p-6 bg-mutedPalette-mutedBlue text-center shadow-lg ">
        {profileLoading && <h1 className="text-4xl font-bold text-white">Loading your profile...</h1>}
        {profileError && <h1 className="text-4xl font-bold text-white">Error loading profile</h1>}
        {profileData && (
          <h1 className="text-4xl font-bold text-white">
            Welcome, {profileData.firstName || "Guest"}!
          </h1>
        )}
        {ecoPointsLoading && <p>Loading your Eco Points...</p>}
        {ecoPointsError && <p>Error loading Eco Points: {ecoPointsError.message}</p>}
        {ecoPointsData && (
          <p className="text-lg mt-4 text-white">
            You've earned{" "}
            <span className="font-semibold text-green-200">
              {ecoPointsData.ecoPoints} Eco Points
            </span>{" "}
            for your sustainable purchases!
          </p>
        )}
        <p className="mt-2 text-white">
          Shop sustainably and redeem your points for exclusive deals.
        </p>
      </div>

      {/* Slideshow */}
      <div className="w-full h-[50vh] relative overflow-hidden mb-8">
        <div
          className="w-full h-full bg-center bg-cover duration-500"
          style={{
            backgroundImage: `url(${slides[currentIndex].url})`,
          }}
        ></div>
      </div>

    
      {/* Top Products Section */}
      <div className="p-6 bg-white mt-8 ml-[40%] lg:ml-[4%] mb-[5%]">
        <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-4">
          Top Selling Products
        </h2>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide p-4">
          {topProductsLoading && <p>Loading top products...</p>}
          {topProductsError && <p>Error loading top products...</p>}
          {topProducts &&
            topProducts.map((product) => (
              <div
                key={product.product}
                className="min-w-[250px] border p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300"
              >
                <img
                  src={product.image}
                  alt={product.product}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="font-bold text-lg mt-2">{product.product}</h3>
                <p className="text-gray-600">Sold: {product.totalSold}</p>
                <p className="text-gray-600">Price: ${product.price}</p>
                            <Link
              to={`/customer/product/${product.id}`} 
              className="mt-2 bg-mutedPalette-mutedBlue text-mutedPalette-beige px-4 py-2 rounded-md hover:bg-green-800"
            >
              View Details
            </Link>
              </div>
            ))}
        </div>
      </div>

   {/* Top Categories */}
<div className="p-4 bg-gray-100 ml-[40%] lg:ml-[4%] ">
  <h2 className="text-3xl font-bold text-center text-mutedPalette-mutedBlue mb-7">
    Top Selling Categories
  </h2>
  <div className="flex flex-wrap justify-center items-center">
    {topCategoriesLoading && <p>Loading categories...</p>}
    {topCategoriesError && <p>Error loading categories</p>}
    {topCategories &&
      topCategories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center mx-5   my-1"
        >
          {/* Circular Image */}
          <div
            className="w-20 h-20 lg:w-24 lg:h-24 bg-center bg-cover rounded-full shadow-md transition-transform hover:scale-110 hover:rotate-3 duration-300"
            style={{
              backgroundImage: `url(${category.image || "/images/category-food.jpg"})`,
            }}
          ></div>

          {/* Category Name */}
          <h3 className="mt-2 text-sm lg:text-base font-bold text-mutedPalette-mutedBlue text-center">
            {category.category}
          </h3>
        </div>
      ))}
  </div>
</div>

      {/* Educational Section */}
      <div className="p-6 bg-gray-100 mt-[5%] ml-[40%] lg:ml-[4%] mb-[15%]">
        <h2 className="text-3xl font-bold text-center text-mutedPalette-mutedBlue mb-6">
          Learn More About Sustainability 🌱
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="https://sdgs.un.org/goals"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white shadow-md hover:shadow-lg transition rounded-lg p-4"
          >
            <img
              src="/images/category-food.jpg"
              alt="Sustainability Video 1"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <h3 className="font-bold text-lg mt-2 text-green-800">
              THE 17 GOALS | Sustainable Development
            </h3>
          </a>
          <a
            href="https://www.euronews.com/tag/eco-friendly#:~:text=Kenya:%20Maasai%20women%20are%20turning,Euroviews."
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white shadow-md hover:shadow-lg transition rounded-lg p-4"
          >
            <img
              src="/images/news.png"
              alt="Sustainability Video 2"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <h3 className="font-bold text-lg mt-2 text-green-800">
              Eco Friendly News | Euroviews
            </h3>
          </a>
          <a
            href="https://www.greenmatch.co.uk/blog/how-to-be-more-eco-friendly"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white shadow-md hover:shadow-lg transition rounded-lg p-4"
          >
            <img
              src="/images/ecofriendly.png"
              alt="Sustainability Video 3"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <h3 className="font-bold text-lg mt-2 text-green-800">
              How to be more Eco-Friendly | GreenMatch
                          </h3>
          </a>
        </div>
      </div>
    <Footer />
    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from "react";
// import { useSwipeable } from "react-swipeable";
// import NavBar from "../Auth/Navigation";
// import {
//   useEcoPointsQuery,
//   useCurrentProfileQuery,
// } from "../../redux/api/usersApiSlice";
// import {
//   useGetTopSellingCategoriesQuery,
//   useGetTopSellingProductsQuery,
// } from "../../redux/api/orderApiSlice";

// const Home = () => {
//   const slides = [
//     { url: "/images/home1.png", title: "Beautiful Nature" },
//     { url: "/images/home2.png", title: "Majestic Mountains" },
//     { url: "/images/home3.png", title: "Serene Waterfalls" },
//     { url: "/images/home4.png", title: "Lush Forest" },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const { data: ecoPointsData, error: ecoPointsError, isLoading: ecoPointsLoading } = useEcoPointsQuery();
//   const { data: profileData, error: profileError, isLoading: profileLoading } = useCurrentProfileQuery();
//   const { data: topCategories, error: topCategoriesError, isLoading: topCategoriesLoading } = useGetTopSellingCategoriesQuery();
//   const { data: topProducts, error: topProductsError, isLoading: topProductsLoading } = useGetTopSellingProductsQuery();

//   const goToNext = () => {
//     const isLastSlide = currentIndex === slides.length - 1;
//     const newIndex = isLastSlide ? 0 : currentIndex + 1;
//     setCurrentIndex(newIndex);
//   };

//   const goToPrevious = () => {
//     const isFirstSlide = currentIndex === 0;
//     const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
//     setCurrentIndex(newIndex);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       goToNext();
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   return (
//     <div className="flex">
//       {/* Navbar */}
//       <NavBar />

//       {/* Main Content */}
//     <div className="flex-1 ml-[40%] lg:ml-[4%] ">
//       {/* Welcome and Eco Points Container */}
//       <div className="p-6 bg-mutedPalette-mutedBlue text-center">
//         {profileLoading && <h1 className="text-4xl font-bold text-white">Loading your profile...</h1>}
//         {profileError && <h1 className="text-4xl font-bold text-white">Error loading profile</h1>}
//         {profileData && (
//           <h1 className="text-4xl font-bold text-white">
//             Welcome, {profileData.firstName || "Guest"}! Your journey to a greener future starts here.
//           </h1>
//         )}

//         {ecoPointsLoading && <p>Loading your Eco Points...</p>}
//         {ecoPointsError && <p>Error loading Eco Points: {ecoPointsError.message}</p>}
//         {ecoPointsData && (
//           <p className="text-lg mt-4 text-white">
//             You've earned <span className="font-semibold text-green-200">{ecoPointsData.ecoPoints} Eco Points</span>
//           </p>
//         )}

//         <p className="mt-2 text-white">
//           Turn your points into big savings on sustainable products. Start shopping today and make an impact!
//         </p>
//       </div>

//         {/* Slideshow */}
//         <div
//           className="w-full h-[30vh] m-auto relative overflow-hidden"
//           style={{ maxWidth: "100%", height: "50vh" }}
//         >
//           <div
//             className="w-full h-full bg-center bg-cover duration-500"
//             style={{
//               backgroundImage: `url(${slides[currentIndex].url})`,
//             }}
//           ></div>
//         </div>

//         {/* Top Products Section */}
//         <div className="p-6 bg-white mt-8">
//           <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-4">Top Selling Products</h2>
//           <div className="flex overflow-x-auto space-x-4 scrollbar-hide p-4">
//             {topProductsLoading && <p>Loading top products...</p>}
//             {topProductsError && <p>Error loading top products: {topProductsError.message}</p>}
//             {topProducts &&
//               topProducts.map((product) => (
//                 <div
//                   key={product.product}
//                   className="min-w-[250px] border p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300"
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.product}
//                     className="w-full h-40 object-cover rounded-md"
//                   />
//                   <h3 className="font-bold text-lg mt-2">{product.product}</h3>
//                   <p className="text-gray-600">Sold: {product.totalSold}</p>
//                   <p className="text-gray-600">Price: ${product.price}</p>
//                   <button
//                     onClick={() => alert(`Clicked on ${product.product}`)}
//                     className="mt-2 bg-mutedPalette-mutedBlue text-mutedPalette-beige px-4 py-2 rounded-md hover:bg-green-800"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div
//     className="p-6 bg-gray-100 mt-8 relative"
//     style={{
//       backgroundImage: `url('/images/home.png')`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat',
//     }}
//   >
//   {/* Add an overlay to make the background faded */}
//   <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

//   <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-4 relative z-10">
//     Top Selling Categories
//   </h2>
//   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
//     {topCategoriesLoading && <p>Loading top categories...</p>}
//     {topCategoriesError && <p>Error loading top categories: {topCategoriesError.message}</p>}
//     {topCategories &&
//       topCategories.map((category) => (
//         <div
//           key={category.category}
//           className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 hover:shadow-xl transition duration-300"
//         >
//           <img
//             src={"/images/category-food.jpg"}
//             alt={category.category}
//             className="w-24 h-24 object-cover rounded-full"
//           />
//           <h3 className="mt-4 font-bold text-green-800">{category.category}</h3>
//         </div>
//       ))}
//   </div>
// </div>
//       </div>
//     </div>
//   );
// };

// export default Home;