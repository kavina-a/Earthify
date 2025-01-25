import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  FaHome,
  FaChartLine,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
  FaHistory
} from "react-icons/fa";

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

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

  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
  };

  return (
    <div
      className={`flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      } bg-greenPalette-darkGreen h-screen fixed transition-width duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className={`text-mutedPalette-beige text-xl font-bold ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          Seller Dashboard
        </h1>
        <button className="text-greenPalette-lightBeige hover:text-mutedPalette-softTan focus:outline-none">
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-4">
          {/* Dashboard */}
          <li>
            <Link
              to="/service-provider/home"
              className="flex items-center text-greenPalette-beige hover:text-mutedPalette-softTan px-4 py-2 transition"
            >
              <FaHome className="text-xl" />
              {!isCollapsed && <span className="ml-4">Dashboard</span>}
            </Link>
          </li>
          {/* Analytics */}
          {/* <li>
            <Link
              to="/analytics"
              className="flex items-center text-greenPalette-beige hover:text-mutedPalette-softTan px-4 py-2 transition"
            >
              <FaChartLine className="text-xl" />
              {!isCollapsed && <span className="ml-4">Analytics</span>}
            </Link>
          </li> */}
          {/* Products */}
          <li>
            <Link
              to="/service-provider/products"
              className="flex items-center text-greenPalette-beige hover:text-mutedPalette-softTan px-4 py-2 transition"
            >
              <FaBoxOpen className="text-xl" />
              {!isCollapsed && <span className="ml-4">Products</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/service-provider/pendingorders"
              className="flex items-center text-greenPalette-beige hover:text-mutedPalette-softTan px-4 py-2 transition"
            >
              <FaHistory className="text-xl" />
              {!isCollapsed && <span className="ml-4">Orders</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-4 py-3">
        <button
          onClick={logoutHandler}
          className="flex items-center text-greenPalette-beige hover:text-mutedPalette-softTan px-4 py-2 transition"
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navigation;