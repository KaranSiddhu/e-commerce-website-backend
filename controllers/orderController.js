const { Order, ProductCartSchema } = require('./../models/order');

exports.getOrderById = (req, res, next, oId) => {
    Order.findById(oId)
    .populate('products.product', "name price")
    .exec((err, order) => {
        if(err || !order){
            return res.status(400).json({
                status:'fail',
                message:'Order not found',
                error:err
            });
        }
        console.log('ORDER - ', order);
        req.order = order;
        next();
    });
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, savedOrder) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Failed to save order',
                error:err
            });
        }
        res.status(200).json({
            status:'success',
            order:savedOrder
        });
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id firstName email")
        .exec((err, orders) => {
            if(err){
                return res.status(400).json({
                    status:'fail',
                    message:'Something went wrong',
                    error:err
                });
            }
            res.status(200).json({
                status:'success',
                orders
            });

        });
}



exports.getOrderStatus = (req, res) => {

    res.json(Order.schema.path('status').enumValues);
}

exports.updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order)=>{
            if(err){
                return res.status(400).json({
                    status:'fail',
                    message:'Updating status failed',
                    error:err
                });
            }
            res.status(200).json({
                status:'success',
                order
            });
        }
    )
}