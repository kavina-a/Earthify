import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  ListOrdered,
} from "lucide-react";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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

  const navItems = [
    { to: "/customer/home", icon: <Home size={24} />, label: "Home" },
    { to: "/customer/shop", icon: <ShoppingBag size={24} />, label: "Shop" },
    { to: "/customer/cart", icon: <ShoppingCart size={24} />, label: "Cart" },
    {
      to: "/customer/favorites",
      icon: <Heart size={24} />,
      label: "Favorites",
    },
    {
      to: "/customer/orders",
      icon: <ListOrdered size={24} />,
      label: "Orders",
    },
  ];

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden  sm:hidden flex-col justify-between p-4 bg-white backdrop-blur-lg text-black w-[5%] hover:w-[15%] h-[100vh] fixed transition-all duration-500 ease-in-out shadow-xl rounded-r-xl border-r border-gray-200`}
    >
      {/* Top Navigation Items */}
      <div className="flex flex-col mt-6 space-y-12">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center group p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <div className="text-black font-bold group-hover:text-black">
              {item.icon}
            </div>
            <span className="hidden group-hover:inline-block ml-4 text-sm tracking-wide uppercase text-black font-bold transition-opacity duration-300">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom User Section */}
      <div className="relative mb-6">
        {userInfo ? (
          <div>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full text-black font-bold hover:text-gray-800 focus:outline-none transition-all"
            >
              <span className="ml-1 text-sm">{userInfo.firstName}</span>
              <svg
                className={`h-4 w-4 ml-2 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute bottom-full mb-2 left-0 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-sm">
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
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              className="flex items-center group p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <AiOutlineLogin
                className="group-hover:text-black font-bold"
                size={22}
              />
              <span className="hidden group-hover:inline-block ml-3 text-sm uppercase text-black font-bold">
                Login
              </span>
            </Link>
            <Link
              to="/register"
              className="flex items-center group p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <AiOutlineUserAdd
                className="group-hover:text-black font-bold"
                size={22}
              />
              <span className="hidden group-hover:inline-block ml-3 text-sm uppercase text-black font-bold">
                Register
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
