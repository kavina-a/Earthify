import { useState, useEffect } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductByIdQuery } from "../../redux/api/productsApiSlice"
import { FaBox, FaClock , FaDollarSign, FaStar, FaUser, FaStore, FaShoppingCart} from "react-icons/fa";
import moment from "moment";
import { useFetchCategoryByIdQuery } from "../../redux/api/categoryApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {

    const { userInfo } = useSelector((state) => state.auth);

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [quantity, setQuantity] = useState(1);
    const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(params._id);
    const { data: categoryData } = useFetchCategoryByIdQuery(productData?.category);

    const addToCartHandler = () => {
      dispatch(addToCart({ ...productData, quantity }));
      navigate("/customer/cart");
    };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-[10rem]"
        >
          Go Back
        </Link>
      </div>
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img
                src={productData?.image}
                alt={productData?.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              />

              {/* <HeartIcon product={product} /> */}
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{productData?.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {productData?.description}
              </p>

              <p className="text-5xl my-4 font-extrabold">$ {productData?.price}</p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    {categoryData?.name}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    {moment(productData?.createAt).fromNow()} 
                    {/* check if this is working properly */}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Reviews:{" "}
                    {productData?.numReviews}
                  </h1>
                </div>

                <div className="two">
                  {/* <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Ratings: {rating}
                  </h1> */}
                   <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    {productData?.quantity}
                  </h1> 
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "}
                    {productData?.countInStock}
                  </h1>
                </div>
              </div>

               <div className="flex justify-between flex-wrap">
                {/* <Ratings
                  value={productData?.rating}
                  text={`${productData?.numReviews} reviews`}
                />  */}

                {productData?.countInStock > 0 && (
                  <div>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(productData?.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div> 

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={productData?.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              {/* <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              /> */}
            </div>
          </div>
        </>
    </>
  );
};

export default ProductDetails;