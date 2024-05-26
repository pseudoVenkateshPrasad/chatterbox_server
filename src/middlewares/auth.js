
import jwt from "jsonwebtoken";

export async function isUserAuthenticated(req, res, next) {
    try {
        let token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ isSuccess: false, message: "UnAuthorized! Token Not Found." });
        let verifiedToken = await verifyToken(token);
        if (verifiedToken.message === "jwt expired" && verifiedToken.expiredAt) {
            return res.status(401).json({ isSuccess: false, message: "Token Expired!" });
        }
        req._id = verifiedToken._id;
        req.email = verifiedToken.email;
        next();
    } catch (err) {
        return res.status(401).json({ isSuccess: false, message: "Error Verifying Token !" });
    }
}


export async function verifyToken(token) {
    try {
        if (!token) return null;
        let response = await jwt.verify(token, process.env.secretKey);
        return response;

    } catch (error) {
        console.log("Couldn't Verify Token !", error);
        return error;
    }
}


// export async function validateRefreshToken(refreshToken) {
//     try {
//         // if (token) {
//         let token = req.cookies.refreshToken;
//         if (!token) return res.status(400).json({ isSuccess: false, message: "UnAuthorized! Token Not Found." });
//         let verifiedToken = await verifyToken(token);

//         if (verifiedToken.message === "jwt expired" && verifiedToken.expiredAt) {
//             return res.status(400).json({ isSuccess: false, message: "Token Expired!" });
//         }

//         req._id = verifiedToken._id;
//         req.email = verifiedToken.email;
//         next();


//         // }
//     } catch (err) {
//         return res.status(400).json({ isSuccess: false, message: "error verifying token 3!" });
//     }
// }
