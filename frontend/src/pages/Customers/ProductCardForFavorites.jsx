import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"; // Import close icon
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

// Only import the removeFromFavorites mutation
import { useRemoveFromFavoritesMutation } from "../../redux/api/productsApiSlice";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  // Mutation hook for removing a product from favorites
  const [removeProductFromFavorites, { isLoading: isRemovingFromFavorites }] =
    useRemoveFromFavoritesMutation();

  // Handler for adding to cart
  const addToCartHandler = (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success("Item added to cart successfully!", {
      autoClose: 2000,
    });
  };

  // Handler for removing from favorites
  const removeFavoriteHandler = async (productId) => {
    try {
      await removeProductFromFavorites(productId).unwrap();
      toast.success("Product removed from favorites!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product from favorites.");
    }
  };

  return (
    <div className="max-w-sm relative bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
      {/* Product Image Section */}
      <section className="relative group">
        {/* Close (“X”) icon button at the top-left corner for removing from favorites */}
        <button
          type="button"
          onClick={() => removeFavoriteHandler(p._id)}
          disabled={isRemovingFromFavorites}
          className="absolute top-3 right-3 bg-mutedPalette-softTan p-2 rounded-full shadow-lg hover:bg-mutedPalette-beige transition-colors duration-300"
        >
          <AiOutlineClose   style={{ strokeWidth: 50 }} 
className="text-mutedPalette-mutedBlue" size={20} />
        </button>

        <Link to={`customer/product/detail/${p._id}`}>
          <span className="absolute top-3 right-3 bg-mutedPalette-softTan text-mutedPalette-beige text-xs font-medium px-2.5 py-0.5 rounded-full shadow-lg">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full h-48 object-cover rounded-t-lg"
            src={p.image}
            alt={p.name}
          />
        </Link>
      </section>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* Product Name */}
          <h5 className="text-lg font-semibold text-mutedPalette-beige">
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

        {/* Action: Add to Cart */}
        <section className="flex justify-between items-center mt-4">
          <button
            className="p-2 bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-full shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition-colors duration-300"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={24} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;