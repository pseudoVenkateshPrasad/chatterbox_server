import User from "../models/users.js";


export const getAllUsers = async (req, res, next) => {
    try {
        let response = await User.find({}, {}, {}, {});

        if(response) {
            return res.status(200).json({isSuccess: true, data: response});
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};