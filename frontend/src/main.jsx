import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import Test from './pages/Auth/Test';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';  
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Customers/Profile';
import CategoryList from './pages/Admin/CategoryList';
import ProductList from './pages/ServiceProviders/ProductList';
import AllProducts from './pages/ServiceProviders/AllProducts';
import ProductUpdate from './pages/ServiceProviders/ProductUpdate';
import ProductDetails from './pages/Customers/ProductDetails';
import Cart from './pages/Customers/Cart';
import Shop from './pages/Customers/Shop';
import Shipping from './pages/Customers/Shipping';
import PlaceOrder from './pages/Customers/PlaceOrder';
import Orders from './pages/Customers/Orders'
import SuccessPage from './pages/Customers/SuccessPage';
import PendingOrders from './pages/ServiceProviders/PendingOrders';
import Home from './pages/Customers/Home';
import Favorites from './pages/Customers/Favorites';
import DashboardHome from './pages/ServiceProviders/Home';
import Products from './pages/ServiceProviders/Products';
import OrderDetail from './pages/ServiceProviders/OrderDetail';

// Create router with routes
const router = createBrowserRouter([
  {
    path: "/",  
    element: <App />,
    children: [
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      // Private Routes
      {
        path: "customer",
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "cart", element: <Cart /> },
          { path: "shop", element: <Shop /> },
          { path: "product/:_id", element: <ProductDetails /> },
          { path: "shipping", element: <Shipping /> },
          { path: "placeorder", element: <PlaceOrder /> },
          { path: "orders", element: <Orders /> },
          { path: "success", element: <SuccessPage /> },
          { path: "home", element: <Home /> },
          { path: "favorites", element: <Favorites /> },
        ],
      },
      {
        path: "service-provider",
        element: <PrivateRoute />,
        children: [
          { path: "productlist", element: <ProductList /> },
          { path: "allproducts", element: < AllProducts/> },
          { path: "product/update/:_id", element: <ProductUpdate /> },
          { path: "pendingorders", element: <PendingOrders /> },
          { path: "home", element: <DashboardHome /> },
          { path: "products", element: <Products /> },
          { path: "order/:orderId", element: <OrderDetail /> },
        ],
      },
      {
        path:"admin",
        element: <PrivateRoute />,
        children: [
          { path: "categorylist", element: <CategoryList /> },
        ],
      }
    ],
  },
]);

// Render the app with RouterProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);