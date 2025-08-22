const User = require("../models/User");
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
                message: error.details[0].message
            });
        }
        
    } catch (error) {
        
    }
} 

//user login

//refresh token

//logout