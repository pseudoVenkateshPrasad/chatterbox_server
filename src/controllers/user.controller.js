import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth.js";

// New User Registration Controller 
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // let payload = req.body;
    let getExistingUser = await User.findOne({ email });

    if (getExistingUser) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User Already Exists !", data: getExistingUser });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newPayload = {
      email,
      password: hashedPassword,
      name
    }

    let createUser = await User.create(newPayload);

    if (createUser) {
      return res
        .status(201).json({ isSuccess: true, message: "User Registered Successfully !", data: createUser });
    } else {
      res.status(500).json({ isSuccess: false, message: "Error Creating User !" });
    }
  } catch (err) {
    res.status(500).json({ isSuccess: false, message: err.message });
  }
};


// Existing User Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
    }

    let getExistingUser = await User.findOne({ email });

    if (!getExistingUser) {
      return res.status(400).json({ isSuccess: false, data: [], message: "User Not Found" });
    }

    if (getExistingUser) {
      let checkPassword = await bcrypt.compare(password, getExistingUser.password);

      if (!checkPassword) {
        return res.status(400).json({ isSuccess: false, data: [], message: "Invalid Password !" });
      }
    }

    let jwtOptions = {
      expiresIn: '1m'
    }

    let accessToken = jwt.sign(
      {
        _id: getExistingUser._id,
        email: getExistingUser.email,
      },
      process.env.secretKey,
      jwtOptions
    );

    let refreshToken = jwt.sign(
      {
        _id: getExistingUser._id,
        email: getExistingUser.email,
      },
      process.env.secretKey);


    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 30000, path: '/' /* 1 minutes */ });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 300000, path: '/' /* 5 min */ });
    res.status(200)
      .json({
        isSuccess: true,
        message: "User Details",
        userData: getExistingUser,
      });
  } catch (err) {
    res.status(500).json({ isSuccess: false, data: [], message: err.message });
  }
};

export const generateNewAccessToken = async (req, res) => {

  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ isSuccess: false, message: "UnAuthorized! Token Not Found." });
  try {
    let checkTokenValidityAndGenerateAccessToken = await verifyToken(refreshToken);
    if (checkTokenValidityAndGenerateAccessToken.expiredAt && checkTokenValidityAndGenerateAccessToken.message === "jwt expired") {
      return res.status(401).json({ isSuccess: false, message: "Refresh Token Expired" });
    }

    let jwtOptions = {
      expiresIn: '1m'
    }

    let newAccessToken = await jwt.sign(
      {
        _id: checkTokenValidityAndGenerateAccessToken._id,
        email: checkTokenValidityAndGenerateAccessToken.email,
      },
      process.env.secretKey,
      jwtOptions
    );

    res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 60000, path: '/' });
    res
      .status(200)
      .json({
        isSuccess: true,
        message: "Access Token Renewed !"
      });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: "Error Verifying Token !" });
  }
}


export const logoutUser = async (req, res) => {
  let cookies = req.cookies;
  try {
    res.clearCookie('accessToken', "/");
    res.clearCookie('refreshToken', "/");
    res.status(200).json({ isSuccess: true, message: "Logged Out Successfully !" });
  } catch (err) {
    res.status(500).json({ isSuccess: false, message: "Server Error 500 !" });
  }

}