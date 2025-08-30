const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel'); // ensure path

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET /*, { expiresIn: '7d' }*/);

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: 'User already exists' });

    if (!validator.isEmail(email)) return res.json({ success: false, message: 'Please enter a valid email' });
    if (password.length < 2 ) return res.json({ success: false, message: 'Please enter a strong password' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new userModel({ name, email, password: hashedPassword }).save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin login
    // const adminLogin = async (req, res) => {
    //   try {
    //     const { email, password } = req.body;
    //     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    //       const token = jwt.sign({ email }, process.env.JWT_SECRET /*, { expiresIn: '1d' }*/);
    //       return res.json({ success: true, token });
    //     }
    //     res.json({ success: false, message: 'Invalid credentials' });
    //   } catch (error) {
    //     console.log(error);
    //     res.json({ success: false, message: error.message });
    //   }
    // };

module.exports = { loginUser, registerUser };
