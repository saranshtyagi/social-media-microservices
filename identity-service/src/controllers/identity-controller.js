const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger");
const { validateRegistration } = require("../utils/validation");

//user registration 
const registerUser = async(req, res) => {
    logger.info('Registration endpoint hit...');
    try {
        //validate the schema 
        const { error } = validateRegistration(req.body); 

        if(error) {
            logger.warn('Validation error', error.details[0].message);
            return res.status(400).json({
                success: false, 
                message: error.details[0].message
            });
        }

        const { username, email, password } = req.body; 

        let checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(checkExistingUser) {
            logger.warn('User already exists');
            return res.status(400).json({
                success: false, 
                message: 'User already exists'
            });
        }

        const user = new User({username, email, password}); 
        await user.save(); 
        logger.warn("User saved successfully", user._id);

        const{accessToken, refreshToken} = await generateTokens(user); 
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            accessToken, 
            refreshToken
        });
        
    } catch (error) {
        logger.error('Registration error occurred!', error);
        res.status(500).json({
            success: false, 
            message: 'Internal Server Error'
        });
    }
} 

//user login

//refresh token

//logout