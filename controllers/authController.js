const User = require('./../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');

exports.signUp = async (req, res) => {
    console.log("REQ BODY",req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        const user = await User.create(req.body);
        
        res.status(200).json({
            status:"success",
            user
        });

    }catch(err){
        res.status(404).json({
            status:'fail',
            error:err.message
        });
    }
}

exports.signIn = (req, res) => {
    console.log("REQ BODY",req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if(err || !user){
           return res.status(400).json({
                status:"fail",
                error:"Users email or password dose not match"
            })
        }

        if(!user.autheticate(password)){
            return res.status(401).json({
                status:"fail",
                error:"Email and password do not match"
            })
        }

        //* create token
        const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
        
        //* puttin token in user cookie
        res.cookie("token", token, { expire:new Date() * 9999 });
        
        //* sending response to front end

        const { _id, name, email, role } = user;
        
        res.status(200).json({
            status:"success",
            token,
            User:{
                _id,
                name,
                email,
                role
            }
        });
    })

}

exports.signOut = (req, res) => {

    res.clearCookie("token");
    res.status(200).json({
        status:'success',
        message:'Sign Out Successfully'
    });
}


//* Protected route
exports.isSignnedIn = expressjwt({
    secret: process.env.JWT_KEY,
    userProperty:"auth"
});

//* Custom middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && ((req.profile._id + '') === req.auth._id);
   
   
    if(!checker){
        return res.status(403).json({   
            status:'fail',
            message:'Access denied'
        });
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            status:'fail',
            message:'Access denied, you are not admin'
        });
    }       
    console.log('YOU ARE ADMIN');
    next();
}