import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const [updateProfile, { isLoading }] = useProfileMutation(); 

  const dispatch = useDispatch();

  // Populate form with current user info
  useEffect(() => {
    if (userInfo) {
      const { email, firstName, lastName, mobileNumber, address } = userInfo;
      setFormData({
        email,
        firstName,
        lastName,
        mobileNumber,
        street: address?.street || '',
        city: address?.city || '',
        postalCode: address?.postalCode || '',
      });
    }
  }, [userInfo]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(setCredentials({ ...updatedUser })); // Update Redux store with new user info
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
       
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;