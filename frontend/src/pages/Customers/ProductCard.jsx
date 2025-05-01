import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

import { useAddToFavoritesMutation } from "../../redux//api/productsApiSlice";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const [addProductToFavorites, { isLoading: isAddingToFavorites }] =
    useAddToFavoritesMutation();

  // Handler for add to cart
  const addToCartHandler = (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success("Item added to cart successfully!", {
      autoClose: 2000,
    });
  };

  // Handler for add to favorites
  const handleAddToFavorites = async (productId) => {
    try {
      console.log(productId);
      await addProductToFavorites(productId).unwrap();
      console.log("Product added to favorites!");
      toast.success("Product added to favorites!");
    } catch (error) {
      console.error(error);
      toast.error("Product has already been added to favorites");
    }
  };

  return (
    <Link
      to={`/customer/product/${p._id}`}
      className=" max-w-sm relative h-auto bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-lg transform hover:scale-105 transition-transform duration-300"
    >
      {/* Product Image Section */}
      <section className="relative group">
        {/* Heart icon button at the top-left corner */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when clicking the button
            handleAddToFavorites(p._id);
          }}
          disabled={isAddingToFavorites}
          className="absolute top-3 left-3 bg-mutedPalette-softTan p-2 rounded-full shadow-lg hover:bg-mutedPalette-beige transition-colors duration-300"
        >
          <AiOutlineHeart className="text-mutedPalette-mutedBlue" size={20} />
        </button>

        <span className="absolute top-3 right-3 bg-mutedPalette-softTan text-mutedPalette-beige text-xs font-medium px-2.5 py-0.5 rounded-full shadow-lg">
          {p?.brand}
        </span>
        <img
          className="cursor-pointer w-full h-48 object-cover rounded-t-lg"
          src={p.image}
          alt={p.name}
        />
      </section>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* Product Name */}
          <h5 className="text-lg font-semibold text-mutedPalette-mutedBlue">
            {p?.name}
          </h5>

          {/* Product Price */}
          <p className="text-mutedPalette-dustyMauve font-bold">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "LKR",
            })}
          </p>
        </div>

        {/* Product Description */}
        <p className="mt-2 text-sm text-mutedPalette-softTan">
          {p?.description?.substring(0, 60)}...
        </p>

        {/* Add to Cart Button */}
        <button
          className="p-2 bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-full shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition-colors duration-300 mt-4"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when clicking the button
            addToCartHandler(p, 1);
          }}
        >
          <AiOutlineShoppingCart size={24} />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
