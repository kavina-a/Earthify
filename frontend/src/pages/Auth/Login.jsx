import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/auth/authSlice'; 
import { useLoginMutation } from '../../redux/api/usersApiSlice'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth); 
    console.log("userInfo:", userInfo);
    
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/customer/home';

    useEffect(() => {
        console.log("userInfo:", userInfo);
        if (userInfo) {
            console.log("Navigating to:", redirect);
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault(); 
        try {
            const response = await login({ email, password }).unwrap(); 
            console.log(response);
            dispatch(setCredentials({...response})); 
            navigate(redirect); 
        } catch (err) {
            toast.error(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen h-screen bg-black">
            <div className="hidden lg:flex w-1/2  relative items-center justify-center">
                <img
                    src="/images/earth.jpg"
                    alt="Earth Background"
                    className="absolute object-cover w-full h-full opacity-50"
                />
                <div className="relative z-10 text-white text-center p-8">
                    <h1 className="text-4xl font-bold mb-4">Earthify</h1>
                    <p className="text-lg leading-relaxed">
                        GREEN isn't a trend, it's a LEGACY
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
             <div className="w-full max-w-md bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <h2 className="text-3xl font-bold text-center mb-4 text-mutedPalette-mutedBlue ">Welcome Back</h2>
                    <p className="text-sm text-center text-gray-400 mb-6">
                        Login to continue your sustainable journey
                    </p>
                    <form onSubmit={submitHandler} className="w-full">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-mutedPalette-mutedBlue font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:mutedPalette-mutedBlue  bg-gray-100 text-gray-800 placeholder-gray-400"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-mutedPalette-mutedBlue font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:mutedPalette-mutedBlue bg-gray-100 text-gray-800 placeholder-gray-400"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 mt-4 text-white bg-mutedPalette-mutedBlue rounded-lg hover:bg-white hover:text-mutedPalette-mutedBlue transition ${
                                isLoading && 'opacity-50 cursor-not-allowed'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">Don't have an account?</span>{' '}
                        <Link to={`/register?redirect=${redirect}`} className="text-mutedPalette-mutedBlue hover:underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
