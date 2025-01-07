import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineOrderedList
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-mutedPalette-mutedBlue w-[4%] hover:w-[12%] h-[100vh] fixed transition-all duration-300 ease-in-out`}
      id="navigation-container"
    >
      {/* Top Section */}
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/customer/home"
          className="flex items-center group transition-all duration-300"
        >
          <AiOutlineHome
            className="mr-2 mt-[3rem] group-hover:translate-x-2 transition-transform duration-300"
            size={26}
          />
          <span className="hidden group-hover:inline-block ml-2 nav-item-name mt-[3rem] transition-opacity duration-300">
            HOME
          </span>
        </Link>

        <Link
          to="/customer/shop"
          className="flex items-center group transition-all duration-300"
        >
          <AiOutlineShopping
            className="mr-2 mt-[3rem] group-hover:translate-x-2 transition-transform duration-300"
            size={26}
          />
          <span className="hidden group-hover:inline-block ml-2 nav-item-name mt-[3rem] transition-opacity duration-300">
            SHOP
          </span>
        </Link>

        <Link
          to="/customer/cart"
          className="flex items-center group transition-all duration-300 relative"
        >
          <AiOutlineShoppingCart
            className="mr-2 mt-[3rem] group-hover:translate-x-2 transition-transform duration-300"
            size={26}
          />
          <span className="hidden group-hover:inline-block ml-2 nav-item-name mt-[3rem] transition-opacity duration-300">
            CART
          </span>
        </Link>

        <Link
          to="/customer/favorites"
          className="flex items-center group transition-all duration-300"
        >
          <FaHeart
            className="mr-2 mt-[3rem] group-hover:translate-x-2 transition-transform duration-300"
            size={20}
          />
          <span className="hidden group-hover:inline-block ml-2 nav-item-name mt-[3rem] transition-opacity duration-300">
            FAVORITES
          </span>
        </Link>

        <Link
          to="/customer/orders"
          className="flex items-center group transition-all duration-300"
        >
          <AiOutlineOrderedList
            className="mr-2 mt-[3rem] group-hover:translate-x-2 transition-transform duration-300"
            size={20}
          />
          <span className="hidden group-hover:inline-block ml-2 nav-item-name mt-[3rem] transition-opacity duration-300">
            ORDERS
          </span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.firstName}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                }
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <div div className = "bg-mutedPalette-mutedBlue text-white" >
            <li className="bg-mutedPalette-mutedBlue hover:bg-mutedPalette-mutedBlue">
              <Link
                to="/profile"
                className="block px-4 py-2 bg-mutedPalette-mutedBlue "
              >
                Profile
              </Link>
            </li>
            <li className="bg-mutedPalette-mutedBlue hover:bg-mutedPalette-mutedBlue ">
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left  bg-mutedPalette-mutedBlue"
              >
                Logout
              </button>
            </li>
            </div>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 group transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin
                  className="mr-2 mt-[4px] group-hover:translate-x-2 transition-transform duration-300"
                  size={26}
                />
                <span className="hidden group-hover:inline-block nav-item-name transition-opacity duration-300">
                  LOGIN
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 group transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd
                  className="mr-2 group-hover:translate-x-2 transition-transform duration-300"
                  size={26}
                />
                <span className="hidden group-hover:inline-block nav-item-name transition-opacity duration-300">
                  REGISTER
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;