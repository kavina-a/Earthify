import React from 'react';
import {
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery,
} from '../../redux/api/productsApiSlice';
import ProductCardForFavorites from './ProductCardForFavorites';
import NavBar from '../Auth/Navigation';
import {
  useGetTopSellingProductsQuery,
} from "../../redux/api/orderApiSlice";

const Favorites = () => {
  const {
    data: favorites,
    isLoading,
    isError,
    error,
  } = useGetFavoritesQuery();

  const {
    data: topProducts,
    isLoading: topProductsLoading,
    isError: topProductsError,
  } = useGetTopSellingProductsQuery();

  if (isLoading) {
    return <p className="ml-[10rem] mt-[3rem]">Loading favorites...</p>;
  }

  if (isError) {
    return (
      <p className="ml-[10rem] mt-[3rem] text-red-500">
        Failed to load favorites: {error?.data?.message || error?.error}
      </p>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Catchy Header Section */}
      <div className="p-6 bg-mutedPalette-mutedBlue text-center ml-[40%] lg:ml-[4%] shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce">
          Find What You Love, Love What You Find ❤️
        </h1>
        <p className="text-lg mt-4 text-mutedPalette-beige font-light">
          Unlock exclusive deals on products you'll adore.
        </p>
        <p className="mt-2 text-mutedPalette-beige text-sm italic">
          "Your favorites, just a click away!"
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-16">
        {/* Favorites Section Header */}
        <h1 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-8 text-center">
        Your selections for a kinder tomorrow
                </h1>

        {/* Content Layout */}
        <div className="flex flex-wrap lg:flex-nowrap gap-12">
          {/* Favorite Products Section */}
          <div className="flex-1">
            {favorites?.length === 0 ? (
              <p className="text-lg text-mutedPalette-mutedBlue text-center">
                No favorite products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favorites.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-lg shadow-md bg-white p-4 hover:scale-105 transform transition-transform duration-300"
                  >
                    <ProductCardForFavorites key={product._id} p={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 lg:max-w-[25%] bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:shadow-xl">
  <h2 className="text-lg font-medium text-mutedPalette-mutedBlue mb-4 text-center">
    You May Like These
  </h2>
  <div className="space-y-4">
    {topProductsLoading && (
      <p className="text-center text-mutedPalette-mutedBlue text-sm">
        Loading top products...
      </p>
    )}
    {topProductsError && (
      <p className="text-center text-red-400 text-sm">
        Error loading top products: {topProductsError.message}
      </p>
    )}
    {topProducts &&
      topProducts.map((product) => (
        <div
          key={product.product}
          className="flex flex-col items-center border p-3 rounded-lg shadow-sm bg-gray-100 hover:shadow-lg hover:scale-105 transform transition-transform duration-300 cursor-pointer"
          onClick={() => alert(`Clicked on ${product.product}`)} // Replace this with navigation to product page
        >
          {/* Emphasized Image */}
          <img
            src={product.image}
            alt={product.product}
            className="w-full h-40 object-cover rounded-md"
          />
          {/* Product Name */}
          <h3 className="font-medium text-base mt-2 text-mutedPalette-mutedBlue text-center">
            {product.product}
          </h3>
          {/* Call-to-Action Text */}
          <p className="text-sm text-gray-600 text-center italic">
            {product.totalSold} products already sold. Grab it now!
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