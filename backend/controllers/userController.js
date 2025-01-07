const asyncHandler = require("../middlewares/asyncHandler.js")
const User = require("../models/userModel.js");
const Customer = require("../models/customerModel.js");
const ServiceProvider = require("../models/serviceProviderModel.js")
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken.js')


const createCustomer =  asyncHandler(async (req,res) => {

    //make something to check if any of the fields are not filled and like send an error message back to them , i think that can be done with something in the backend as well.
    
    const { email, password, firstName, lastName, mobileNumber, address, preferences } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create and save a new user
    const user = new User({ email, password: hashedPassword,role: "customer"});

    try {

    const savedUser = await user.save();

    const customer = new Customer({
      user: savedUser._id,
      firstName,
      lastName,
      mobileNumber,
      address,
      preferences: preferences || [],
    });

    const savedCustomer = await customer.save();
    
    createToken(res, savedUser._id, savedUser.role);

    res.status(201).json({
      message: "Customer created successfully",
      user: savedUser,
      customer: savedCustomer,
    });

    //?not really sure after this part , check on it 
  } catch (error) {
    res.status(500).json({ message: `Error creating user, ${error}` });
  }
});


const createServiceProvider = asyncHandler(async (req, res) => {
  const { email, password, businessName, businessLocation, coverImage, mobileNumber } = req.body;

  if (!email || !password || !businessName || !businessLocation || !coverImage || !mobileNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save the User document
  const user = new User({
    email,
    password: hashedPassword,
    role: "serviceProvider",
  });

  try {
    const savedUser = await user.save();

    // Create and save the ServiceProvider document
    const serviceProvider = new ServiceProvider({
      user: savedUser._id,
      businessName,
      businessLocation,
      coverImage,
      mobileNumber,
    });

    const savedServiceProvider = await serviceProvider.save();

    createToken(res, savedUser._id, savedUser.role);

    res.status(201).json({
      message: "Service Provider created successfully",
      user: savedUser,
      serviceProvider: savedServiceProvider,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating service provider", error: error.message });
  }
});


const loginUser = asyncHandler( async (req,res) => {

  try {
    const {email,password } = req.body

    const existingUser = await User.findOne({email})
    const existingCustomer = await Customer.findOne({user: existingUser._id})

      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        console.log("Password mismatch for email:", email); 
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log(existingUser.role);
    

      createToken(res, existingUser._id, existingUser.role);

      res.status(201).json({ userId: existingUser._id,email: existingUser.email, ecoPoints: existingCustomer.ecoPoints});
      // res.status(201).json({ userId: existingUser._id,email: existingUser.email, ecoPoints: existingCustomer.ecoPoints});

    } catch (err) {
      console.error("Error during login:", err);  
      res.status(500).json({ error: err.message });
    }
  });
  

  const logoutUser = asyncHandler( async(req,res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    })

    res.status(200).json({message: "Logged out successfully"})

  })

  const getCurrentUserProfile = asyncHandler(async (req, res) => { 
    
    const user = await User.findById(req.user._id);

    const customer = await Customer.findOne({user: user._id});

    if(user) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: customer.firstName,
      });
    } else {
      throw new Error("User not found")
    }
  });


  const updateCurrentUserProfile = asyncHandler(async (req, res) => {

    try {

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role  === 'customer') {

        const customer = await Customer.findOne({ user: user._id });
        
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }

        customer.firstName = req.body.firstName || customer.firstName;  
        customer.lastName = req.body.lastName || customer.lastName; 
        customer.mobileNumber = req.body.mobileNumber || customer.mobileNumber;
        customer.address = req.body.address || customer.address;

        await customer.save();
        
      }

      if (user.role === 'serviceProvider') {

        const serviceProvider = await ServiceProvider.findOne({ user: user._id});
        
        if (!serviceProvider) {
          return res.status(404).json({ message: 'Service Provider not found' });
        }

        serviceProvider.businessName = req.body.businessName || serviceProvider.businessName;
        serviceProvider.businessLocation = req.body.businessLocation || serviceProvider.businessLocation;
        serviceProvider.coverImage = req.body.coverImage || serviceProvider.coverImage;
        serviceProvider.mobileNumber = req.body.mobileNumber || serviceProvider.mobileNumber;

        await serviceProvider.save();
      }

      user.email = req.body.email || user.email;

        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(req.body.password, salt);
        }

      await user.save();

      res.status(200).json({ message: "User profile updated successfully" });

    } catch (error) {
      res.status(500).json({ message: `Error updating user profile, ${error}` });
    };
  });

//got a problem on how we are gonna send the id, so an admin clicks on the button and it passes the id too ?
  const deleteUser = asyncHandler(async(req,res) => {
    
    const user = await User.findById(req.params.id);

    if (user) {

      if ( user.role === 'admin') {

        res.status(400);
        throw new Error("Cannot delete admin user")

      }

      await User.deleteOne({_id: user.id});
      res.json({message:"User Removed"});
    } else {
      res.status(404);
      throw new Error("User not found")
    }
  })

  const getEcoPoints = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);
    const customer = await Customer.findOne({user: user._id});

    if (customer) {
      res.json({ecoPoints: customer.ecoPoints});
    }
  }
  )

  const getCurrentProfile = asyncHandler(async (req, res) => { 
    
    const user = await User.findById(req.user._id);

    const customer = await Customer.findOne({user: user._id});

    if(user) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: customer.firstName,
      });
    } else {
      throw new Error("User not found")
    }
  });


  


module.exports = { createCustomer , createServiceProvider, loginUser, logoutUser, getCurrentUserProfile, updateCurrentUserProfile, deleteUser, getEcoPoints, getCurrentProfile }