import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../../redux/features/auth/authSlice'
import {toast} from 'react-toastify'

import { useRegisterCustomerMutation, useRegisterServiceProviderMutation } from '../../redux/api/usersApiSlice'

const Register = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    street: '',
    city: '',
    postalCode: '',
    preferences: [],
    ecoPoints: 0,
    businessName: '',
    businessLocation: '',
    coverImage: '',
  });
  const [currentStep, setCurrentStep] = useState(1); // Fix: Add currentStep state


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerCustomer, { isLoading: isCustomerLoading }] = useRegisterCustomerMutation();
  const [registerServiceProvider, { isLoading: isServiceProviderLoading }] = useRegisterServiceProviderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) { 
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])


  // Handle input change for both forms
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle role selection (Customer or ServiceProvider)
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({
      ...formData,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      street: '',
      city: '',
      postalCode: '',
      preferences: [],
      ecoPoints: 0,
      businessName: '',
      businessLocation: '',
      coverImage: '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //!to stop this whole thing remove the address object from the backend and keep it as single individual fields
    if (role === 'customer') {

      const address = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
      };

      const payload = {
        ...formData,
        address, // Add address object to payload
      };

      console.log('Registering Customer Payload:', payload); // Debugging Payload

    
      // Remove individual fields no longer needed
      delete payload.street;
      delete payload.city;
      delete payload.postalCode;
    
      console.log('Registering Customer:', formData);
       try {
        const res = await registerCustomer(payload).unwrap()
        dispatch(setCredentials({...res}))
        navigate(redirect)
        toast.success('Account created successfully')
       }
       catch(error) {
        console.error('Registration Error:', error);
         toast.error(error.message)
       }
    } else if (role === 'serviceProvider') {
      console.log('Registering Service Provider:', formData);
      try {
        const res = await registerServiceProvider(formData).unwrap()
        dispatch(setCredentials({...res}))
        navigate(redirect)
        toast.success('Account created successfully')
       }
       catch(error) {
        console.error('Registration Error:', error);
         toast.error(error.message)
       }

      // Call your API to register the service provider here
    }
  };

  return (
    <div className="flex min-h-screen h-screen bg-black">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        <img
          src="/images/earth.jpg"
          alt="Earth Background"
          className="absolute object-cover w-full h-full opacity-50"
        />
        <div className="relative z-10 text-white text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Earthify</h1>
          <p className="text-lg leading-relaxed">GREEN isn't a trend, it's a LEGACY</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Create an Account</h2>
          <p className="text-sm text-center text-gray-400 mb-6">
            Join us in making a difference!
          </p>

          {/* Role Selection */}
          <div className="mb-4 flex justify-center">
            <button
              value="customer"
              onClick={handleRoleChange}
              className={`px-4 py-2 mr-2 rounded-lg ${
                role === 'customer' ? 'bg-mutedPalette-mutedBlue text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Customer
            </button>
            <button
              value="serviceProvider"
              onClick={handleRoleChange}
              className={`px-4 py-2 rounded-lg ${
                role === 'serviceProvider' ? 'bg-mutedPalette-mutedBlue text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Service Provider
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {role === 'customer' && currentStep === 1 && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />

                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
              </>
            )}

            {role === 'customer' && currentStep === 2 && (
              <>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />

                <textarea
                  name="preferences"
                  placeholder="Preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                />
              </>
            )}

            {role === 'serviceProvider' && (
                  <>
                    <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"

                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"
                    required
                  />
                    <div className="service-provider-fields">
                      <input
                        type="text"
                        name="businessName"
                        placeholder="Business Name"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"

                      />
                      <input
                        type="text"
                        name="businessLocation"
                        placeholder="Business Location"
                        value={formData.businessLocation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"

                      />
                      <input
                        type="text"
                        name="coverImage"
                        placeholder="Cover Image URL"
                        value={formData.coverImage}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"

                      />
                      <input
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mb-4 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100 text-gray-800 placeholder-gray-400"

                      />

                    </div>
                  </>
                )}

            <div className="flex justify-between mt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                  Back
                </button>
              )}
              {currentStep < 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-mutedPalette-mutedBlue text-white rounded-lg"
                >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-mutedPalette-mutedBlue text-white hover:text-mutedPalette-mutedBlue hover:bg-white rounded-lg"
                >
                  Register
                </button>
              )}
            </div>
          </form>

          {/* Already have an account */}
          <div className="mt-4 text-center">
            <span className="text-gray-600">Already have an account?</span>{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-mutedPalette-mutedBlue hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// import React, { useState, useEffect } from 'react'
// import { Link, useLocation, useNavigate} from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { setCredentials } from '../../redux/features/auth/authSlice'
// import {toast} from 'react-toastify'

// import { useRegisterCustomerMutation, useRegisterServiceProviderMutation } from '../../redux/api/usersApiSlice'

// const Register = () => {
//   const [role, setRole] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     mobileNumber: '',
//     street: '',
//     city: '',
//     postalCode: '',
//     preferences: [],
//     ecoPoints: 0,
//     businessName: '',
//     businessLocation: '',
//     coverImage: '',
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [registerCustomer, { isLoading: isCustomerLoading }] = useRegisterCustomerMutation();
//   const [registerServiceProvider, { isLoading: isServiceProviderLoading }] = useRegisterServiceProviderMutation();

//   const { userInfo } = useSelector((state) => state.auth);

//   const { search } = useLocation();
//   const sp = new URLSearchParams(search)
//   const redirect = sp.get('redirect') || '/'

//   useEffect(() => {
//     if (userInfo) { 
//       navigate(redirect)
//     }
//   }, [navigate, userInfo, redirect])


//   // Handle input change for both forms
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle role selection (Customer or ServiceProvider)
//   const handleRoleChange = (e) => {
//     setRole(e.target.value);
//     setFormData({
//       ...formData,
//       firstName: '',
//       lastName: '',
//       mobileNumber: '',
//       street: '',
//       city: '',
//       postalCode: '',
//       preferences: [],
//       ecoPoints: 0,
//       businessName: '',
//       businessLocation: '',
//       coverImage: '',
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     //!to stop this whole thing remove the address object from the backend and keep it as single individual fields
//     if (role === 'customer') {

//       const address = {
//         street: formData.street,
//         city: formData.city,
//         postalCode: formData.postalCode,
//       };

//       const payload = {
//         ...formData,
//         address, // Add address object to payload
//       };
    
//       // Remove individual fields no longer needed
//       delete payload.street;
//       delete payload.city;
//       delete payload.postalCode;
    
//       console.log('Registering Customer:', formData);
//        try {
//         const res = await registerCustomer(payload).unwrap()
//         dispatch(setCredentials({...res}))
//         navigate(redirect)
//         toast.success('Account created successfully')
//        }
//        catch(error) {
//         console.error('Registration Error:', error);
//          toast.error(error.message)
//        }
//     } else if (role === 'serviceProvider') {
//       console.log('Registering Service Provider:', formData);
//       try {
//         const res = await registerServiceProvider(formData).unwrap()
//         dispatch(setCredentials({...res}))
//         navigate(redirect)
//         toast.success('Account created successfully')
//        }
//        catch(error) {
//         console.error('Registration Error:', error);
//          toast.error(error.message)
//        }

//       // Call your API to register the service provider here
//     }
//   };

//   return (
//     <div className="register-container">
//       <h2>Register</h2>

//       {/* Step 2: Role selection */}
//       <div className="role-selection">
//         <button value="customer" onClick={handleRoleChange}>
//           Register as Customer
//         </button>
//         <button value="serviceProvider" onClick={handleRoleChange}>
//           Register as Service Provider
//         </button>
//       </div>

//       {/* Step 3: Conditional rendering of forms based on selected role */}
//       <form onSubmit={handleSubmit}>

//         {role === 'customer' && (
//           <>
//             <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//             <div className="customer-fields">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="mobileNumber"
//                 placeholder="Mobile Number"
//                 value={formData.mobileNumber}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street"
//                 value={formData.street}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal Code"
//                 value={formData.postalCode}
//                 onChange={handleChange}
//                 required
//               />
//               <textarea
//                 name="preferences"
//                 placeholder="Preferences (comma separated)"
//                 value={formData.preferences}
//                 onChange={handleChange}
//               />
//             </div>
//           </>
//         )}

//         {role === 'serviceProvider' && (
//           <>
//             <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//             <div className="service-provider-fields">
//               <input
//                 type="text"
//                 name="businessName"
//                 placeholder="Business Name"
//                 value={formData.businessName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="businessLocation"
//                 placeholder="Business Location"
//                 value={formData.businessLocation}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="coverImage"
//                 placeholder="Cover Image URL"
//                 value={formData.coverImage}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="mobileNumber"
//                 placeholder="Mobile Number"
//                 value={formData.mobileNumber}
//                 onChange={handleChange}
//                 required
//               />

//             </div>
//           </>
//         )}

//         <button type="submit">Register</button>
//       </form>

//       <div>
//         <p>Already have an account ?{ " "} 
//           <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link></p> //check this redirect thing i dont get it 
//       </div>
      
//     </div>
//   );
// };

// export default Register;