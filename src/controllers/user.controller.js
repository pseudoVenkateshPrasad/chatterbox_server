import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // let payload = req.body;
    let getExistingUser = await User.findOne({ email });

    if (getExistingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", data: getExistingUser });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    
    let newPayload = {
      email,
      password : hashedPassword,
      name
    }

    let createUser = await User.create(newPayload);

    if (createUser) {
      return res
        .status(201)
        .json({ message: "User Registered Successfully", data: createUser });
    } else {
      res.status(500).json({ message: "error creating user" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
    }

    let getExistingUser = await User.findOne({ email });

    if (!getExistingUser) {
      return res.status(200).json({ message: "user not found" });
    }

    if(getExistingUser) {
      let checkPassword = await bcrypt.compare(password, getExistingUser.password);

      if(!checkPassword) {
        return res.status(200).json({ message: "invalid password !" });
      }
    }


    let createToken = jwt.sign(
      {
        _id: getExistingUser._id,
        email: getExistingUser.email,
      },
      process.env.secretKey
    );

    return res
      .status(200)
      .json({
        message: "User found",
        userData: getExistingUser,
        accessToken: createToken,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export default register;
