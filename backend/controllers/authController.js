import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


// User registration
export const register = async (req, res) => {

    // hashing password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
        })

        await newUser.save()

        res.status(200).json({
            success: true,
            message: 'User successfully created'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create. Try again'
        })
    }
}


// User login
export const login = async (req, res) => {

    const email = req.body.email

    try {
        const user = await User.findOne({ email })

        // if user does not exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // if user already exists then check the password or compare the password
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        // if password is incorrect
        if (!checkCorrectPassword) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            })
        }

        const { password, role, ...rest } = user._doc

        // create jwt token
        const token = jwt.sign({
            id: user._id,
            role: user.role
        },
            process.env.JWT_SECERET_KEY,
            { expiresIn: "15d" })


        // set tokenn in the browser cookies and send response to client
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: token.expiresIn
        }).status(200).json({
            token,
            data: { ...rest },
            role,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to login'
        })
    }
}