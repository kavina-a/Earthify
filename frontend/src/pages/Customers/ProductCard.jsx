import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

import { useAddToFavoritesMutation } from "../../redux//api/productsApiSlice"; 

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  
  const [addProductToFavorites, { isLoading: isAddingToFavorites }] = useAddToFavoritesMutation();

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
      console.log(productId)
      await addProductToFavorites(productId).unwrap();
      console.log("Product added to favorites!");
      toast.success("Product added to favorites!");
    } catch (error) {
      console.error(error);
      toast.error("Product has already been added to favorites");
    }
  };

  return (
    <div className="max-w-sm relative bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
      {/* Product Image Section */}
      <section className="relative group">
        {/* Heart icon button at the top-left corner */}
        <button
          type="button"
          onClick={() => handleAddToFavorites(p._id)}
          disabled={isAddingToFavorites}
          className="absolute top-3 left-3 bg-mutedPalette-softTan p-2 rounded-full shadow-lg hover:bg-mutedPalette-beige transition-colors duration-300"
        >
          <AiOutlineHeart className="text-mutedPalette-beige" size={20} />
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

        {/* Actions: Read More & Add to Cart */}
        <section className="flex justify-between items-center mt-4">
          {/* <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-mutedPalette-mutedBlue hover:bg-mutedPalette-dustyMauve text-white rounded-lg shadow-md transition-colors duration-300"
          >
            Read More
          </Link> */}

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
// import { Link } from "react-router-dom";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../redux/features/cart/cartSlice";
// import { toast } from "react-toastify";

// const ProductCard = ({ p }) => {
//   const dispatch = useDispatch();

//   const addToCartHandler = (product, quantity) => {
//     dispatch(addToCart({ ...product, quantity }));
//     toast.success("Item added to cart successfully!", {
//       autoClose: 2000,
//     });
//   };

//   return (
//     <div className="max-w-sm relative bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
//       {/* Product Image Section */}
//       <section className="relative group">
//         <Link to={`customer/product/detail/${p._id}`}>
//           <span className="absolute top-3 right-3 bg-mutedPalette-softTan text-mutedPalette-beige text-xs font-medium px-2.5 py-0.5 rounded-full shadow-lg">
//             {p?.brand}
//           </span>
//           <img
//             className="cursor-pointer w-full h-48 object-cover rounded-t-lg"
//             src={p.image}
//             alt={p.name}
//           />
//         </Link>
//       </section>

//       {/* Product Info */}
//       <div className="p-4">
//         <div className="flex justify-between items-center">
//           {/* Product Name */}
//           <h5 className="text-lg font-semibold text-mutedPalette-beige">
//             {p?.name}
//           </h5>

//           {/* Product Price */}
//           <p className="text-mutedPalette-dustyMauve font-bold">
//             {p?.price?.toLocaleString("en-US", {
//               style: "currency",
//               currency: "LKR",
//             })}
//           </p>
//         </div>

//         {/* Product Description */}
//         <p className="mt-2 text-sm text-mutedPalette-softTan">
//           {p?.description?.substring(0, 60)}...
//         </p>

//         {/* Actions: Read More & Add to Cart */}
//         <section className="flex justify-between items-center mt-4">
//           <Link
//             to={`/product/${p._id}`}
//             className="inline-flex items-center px-4 py-2 text-sm font-medium bg-mutedPalette-mutedBlue hover:bg-mutedPalette-dustyMauve text-white rounded-lg shadow-md transition-colors duration-300"
//           >
//             Read More
//           </Link>

//           <button
//             className="p-2 bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-full shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition-colors duration-300"
//             onClick={() => addToCartHandler(p, 1)}
//           >
//             <AiOutlineShoppingCart size={24} />
//           </button>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;