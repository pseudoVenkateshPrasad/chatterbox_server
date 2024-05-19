
import jwt from "jsonwebtoken";


export async function isUserAuthenticated(req, res, next) {

    try {
        // if (token) {
        let authorization = req.headers?.authorization;
        let token = authorization?.split(' ')[1];
        if (!token) return res.status(400).json({ isSuccess: false, message: "cannot verify token !" });
        let verifiedToken = await verifyToken(token);

        if (!verifiedToken) {
            return res.status(400).json({ isSuccess: false, message: "cannot verify token !" });
        }

        req._id = verifiedToken._id;
        req.email = verifiedToken.email;
        next(); 


        // }
    } catch (err) {
        return res.status(400).json({ isSuccess: false, message: "cannot verify token !" });
    }



}


export async function verifyToken(token) {
    try {
        if (!token) return null;

        return jwt.verify(token, process.env.secretKey);

    } catch (e) {
        console.log("couldn't verify token", e);
        return null
    }
}



