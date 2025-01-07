import { Navigate, Outlet } from "react-router"
import { useSelector } from "react-redux"

const PrivateRoute = () => {

    const { userInfo } = useSelector((state) => state.auth);

    // If user is logged in, render the child components 
  return userInfo ? <Outlet /> : <Navigate to="/login" />
  //maybe add a toast
  
}

export default PrivateRoute
