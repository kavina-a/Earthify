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

  const {
    data: ecoPointsData,
    isLoading: ecoPointsLoading,
    error: ecoPointsError,
  } = useEcoPointsQuery();
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useCurrentProfileQuery();
  console.log(profileData);
  const {
    data: topCategories,
    isLoading: topCategoriesLoading,
    error: topCategoriesError,
  } = useGetTopSellingCategoriesQuery();
  const {
    data: topProducts,
    isLoading: topProductsLoading,
    error: topProductsError,
  } = useGetTopSellingProductsQuery();
  console.log(topProducts);
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

      {/* Slideshow */}
      <div className="w-full h-[50vh] relative overflow-hidden mb-8">
        <div
          className="w-full h-full bg-center bg-cover duration-500"
          style={{
            backgroundImage: `url(${slides[currentIndex].url})`,
          }}
        ></div>
      </div>

      <div className="max-w-md mx-auto p-6 bg-mutedPalette-mutedBlue text-center shadow-xl rounded-xl mt-8 hover:shadow-2xl transition-shadow duration-300">
        {profileLoading && (
          <h1 className="text-2xl font-extrabold text-white">
            Loading your profile...
          </h1>
        )}
        {profileError && (
          <h1 className="text-2xl font-extrabold text-white">
            Error loading profile
          </h1>
        )}
        {profileData && (
          <h1 className="text-2xl font-extrabold text-white">
            Welcome, {profileData.firstName || "Guest"}!
          </h1>
        )}

        {ecoPointsLoading && (
          <p className="text-sm text-white mt-2">Loading your Eco Points...</p>
        )}
        {ecoPointsError && (
          <p className="text-sm text-white mt-2">
            Error loading Eco Points: {ecoPointsError.message}
          </p>
        )}
        {ecoPointsData && (
          <p className="text-md mt-4 text-white">
            You've earned{" "}
            <span className="font-bold text-green-200">
              {ecoPointsData.ecoPoints} Eco Points
            </span>{" "}
            for your sustainable purchases!
          </p>
        )}

        <p className="mt-3 text-sm text-white opacity-90">
          Shop sustainably and redeem your points for exclusive deals.
        </p>
      </div>

      <section className="w-full mt-10 py-12 bg-gradient-to-b from-white via-mutedPalette-beige to-mutedPalette-mutedBlue">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-mutedPalette-mutedBlue mb-10 tracking-wide">
            TOP PICKS OF THE SEASON
          </h2>
          <div className="flex overflow-x-auto space-x-6 snap-x snap-mandatory scrollbar-hide">
            {topProductsLoading && (
              <p className="text-mutedPalette-mutedBlue animate-pulse">
                Loading top products...
              </p>
            )}
            {topProductsError && (
              <p className="text-red-500">Error loading top products...</p>
            )}
            {topProducts &&
              topProducts.map((product) => (
                <div
                  key={product.product}
                  className="flex-shrink-0 snap-center w-60 bg-white bg-opacity-90 backdrop-blur-xl border border-mutedPalette-mutedBlue p-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.product}
                    className="w-full h-40 object-cover rounded-xl mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <h3 className="font-semibold text-lg text-mutedPalette-mutedBlue mb-1 line-clamp-2">
                    {product.product}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    🔥 Sold: {product.totalSold}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    💰 ${product.price}
                  </p>
                  <Link
                    to={`/customer/product/${product.id}`}
                    className="inline-block w-full bg-mutedPalette-mutedBlue text-mutedPalette-beige px-4 py-2 rounded-lg shadow hover:bg-green-700 hover:text-white transition-all duration-300 text-center text-sm"
                  >
                    View Details
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-mutedPalette-mutedBlue mb-10 tracking-wide">
            Explore Popular Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {topCategoriesLoading && (
              <p className="text-mutedPalette-mutedBlue animate-pulse">
                Loading categories...
              </p>
            )}
            {topCategoriesError && (
              <p className="text-red-500">Error loading categories</p>
            )}
            {topCategories &&
              topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group transition-transform hover:-translate-y-1 duration-300"
                >
                  {/* Circular Image */}
                  <div
                    className="w-24 h-24 lg:w-28 lg:h-28 bg-center bg-cover rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundImage: `url(${
                        category.image || "/images/category-food.jpg"
                      })`,
                    }}
                  ></div>

                  {/* Category Name */}
                  <h3 className="mt-3 text-sm lg:text-base font-semibold text-mutedPalette-mutedBlue text-center group-hover:text-green-700 transition-colors duration-300">
                    {category.category}
                  </h3>
                </div>
              ))}
          </div>
        </div>
      </section>

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
