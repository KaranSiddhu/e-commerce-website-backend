const User = require('./../models/user');
const Order = require('./../models/order');

//* param middleware to put user data in req objects
exports.getUserById = (req, res, next, id) => {
        User.findById(id).exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    status:'fail',
                    messsage:'User not found',
                    error:err
                });
            }
            console.log("GET USER BY ID -", user);
            req.profile = user;
            next();
        });
}

exports.getUser =  (req, res) => {
    console.log('REQ AUTH - ', req.auth);
    req.profile.salt = undefined;
    req.profile.secure_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);

}


exports.updateUser =  (req, res) => {
    
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, userFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(404).json({
                    status:'fail',
                    message:'You are not authorized to update',
                    error:err
                });
            }
            user.salt = undefined;
            user.secure_password = undefined;
            res.status(200).json({
                status:'success',
                user
            });

        }
    );
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id firstName lastName")
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                status:'fail',
                message:'No order in this account',
                error:err
            });
        }
        
        return res.status(200).json({
            status:'success',
            order
        });
    })
}

//* Middleware to push all order in our User model purchase list
exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = [];
    req.body.order.products.forEach(product  => {
        const { _id, name, description, category } = product;
        purchases.push({
            _id,
            name,
            description,
            category,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //* Store in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        
        //* That purchases is comming from user model
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchaseLists) => {
            if(err){
                return res.status(404).json({
                    status:'fail',
                    message:'Unable to save purchase list',
                    error:err
                });
            }
            next();
        }
    );
}
