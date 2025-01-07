const jwt = require('jsonwebtoken')

const generateToken = ( res, userId, role ) => {
    const token = jwt.sign({userId, role }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    //setting jwt as an http-only cookie 
    //!check on this again
    res.cookie('jwt', token, {
        httpOnly: true, //cookie can ony be accessed by http requests 
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    
    return token;
};

module.exports = generateToken