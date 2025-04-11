import React from "react";
import { useGetFavoritesQuery } from "../../redux/api/productsApiSlice";
import ProductCardForFavorites from "./ProductCardForFavorites";
import NavBar from "../Auth/Navigation";
import { useGetTopSellingProductsQuery } from "../../redux/api/orderApiSlice";

const Favorites = () => {
  const { data: favorites, isLoading, isError, error } = useGetFavoritesQuery();
  const {
    data: topProducts,
    isLoading: topProductsLoading,
    isError: topProductsError,
  } = useGetTopSellingProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-600">
        Loading your favorites...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-red-500">
        Failed to load favorites: {error?.data?.message || error?.error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Page Container */}
      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Hero Container */}
        <div className="relative bg-gradient-to-r from-mutedPalette-sageGreen via-white to-mutedPalette-mutedBlue rounded-3xl shadow-2xl p-12 text-center space-y-6 border border-gray-200 overflow-hidden">
          {/* Soft Background Circles */}
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-primaryGreen-light opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primaryBrown opacity-10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Optional Badge */}
          <div className="inline-block bg-white border border-mutedPalette-mutedBlue text-mutedPalette-mutedBlue text-sm font-semibold px-4 py-1 rounded-full shadow-sm uppercase tracking-wide">
            Favorites Collection
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-mutedPalette-mutedBlue leading-tight drop-shadow-sm">
            Curated Just for You
          </h1>

          {/* Subtitle */}
          <p className="text-gray-700 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Explore your favorite picks and discover top-rated products chosen
            to complement your style and values.
          </p>

          {/* Accent Divider */}
          <div className="w-20 h-1 bg-primaryGreen-light mx-auto rounded-full"></div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Favorites Section Container */}
          <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 space-y-6 border">
            <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue border-b pb-4">
              Your Favorite Products
            </h2>

            {favorites?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg font-semibold text-gray-500">
                  You haven’t saved any favorites yet.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Start adding products to build your collection!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 p-4 hover:scale-105 transform transition-transform duration-300 hover:shadow-2xl border"
                  >
                    <ProductCardForFavorites key={product._id} p={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendation Sidebar Container */}
          <div className="flex-1 lg:max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6 border">
            <h2 className="text-2xl font-bold text-mutedPalette-mutedBlue border-b pb-3 text-center">
              You May Like These
            </h2>

            <div className="space-y-6">
              {topProductsLoading && (
                <p className="text-center text-mutedPalette-mutedBlue text-base font-medium">
                  Loading recommendations...
                </p>
              )}
              {topProductsError && (
                <p className="text-center text-red-500 text-base font-medium">
                  Error loading recommendations: {topProductsError.message}
                </p>
              )}

              {topProducts &&
                topProducts.map((product) => (
                  <div
                    key={product.product}
                    className="flex flex-col items-center border border-gray-200 p-4 rounded-2xl shadow-sm bg-gray-50 hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
                    onClick={() => alert(`Clicked on ${product.product}`)} // Replace with navigation
                  >
                    <img
                      src={product.image}
                      alt={product.product}
                      className="w-full h-36 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-bold text-base text-mutedPalette-mutedBlue text-center">
                      {product.product}
                    </h3>
                    <p className="text-sm text-gray-600 text-center mt-1">
                      {product.totalSold} already sold. Get yours today!
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
