import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'You are not Authorized'
        })
    }

    // if token already existes than verify the token
    jwt.verify(token, process.env.JWT_SECERET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            })
        }
        req.user = user

        next() // don't forget to call next 
    })
}


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user._id === req.params.id || req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).json({
                success: false,
                message: 'You are not authenticated'
            })
        }
    })
}


export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).json({
                success: false,
                message: 'You are not Authorized'
            })
        }
    })
}