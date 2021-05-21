const Products = require('./../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, next, pId) => {

    Products.findById(pId)
    .populate("category")
    .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                status:'fail',
                messsage:'Product not found',
                error:err
            });
        }
        console.log("PRODUCT -", product);
        req.product = product;
        next();
    });

}

exports.createProduct = (req, res) => {
  
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Problem with image',
                err
            });
        }

        
        const { name, price, description, category, stock } = fields;

        if( !name || !description || !price || !category ||!stock ){
          
            return res.status(400).json({
                status:'fail',
                message:'Please includes all the fields',
                
            });

        }

        let product = new Products(fields);
    
        //* Handle File
        if(file.photo){
            
            //* file size should not be greater than 3 mb 
            if(file.photo.size > (3 * 1024 * 1024)){
                return res.status(400).json({
                    status:'fail',
                    messsage:'File size to big'
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        console.log("FIELDs - ",fields);
        console.log("FILE - ",file);

        //* Save To DB
        product.save((error, savedProduct) => {
        
            if(error){
                return res.status(400).json({
                    status:'fail',
                    message:'saving the picture failed',
                    error
                });
            }
            
            res.status(200).json({
                status:'success',
                savedProduct
            });

        })

    });
   
} 

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    res.status(200).json({
        status:'success',
        product:req.product
    });
}

//* middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req, res) => {
    const product = req.product;
    product.remove((err, deletedProduct) => {
        if(err || product === null){
            return res.status(400).json({
                status:'fail',
                message:'Failed to delete this Product',
                error:err
            });
        }
        res.status(200).json({
            status:'success',
            message:`successfully deleted '${deletedProduct.name}' Product`
        });
    })

}

exports.updateProduct = (req, res) => {
  
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Problem with image',
                err
            });
        }

        //*updating product
        let product = req.product;
        product = _.extend(product, fields);
    
        //* Handle File
        if(file.photo){
            
            //* file size should not be greater than 3 mb 
            if(file.photo.size > (3 * 1024 * 1024)){
                return res.status(400).json({
                    status:'fail',
                    messsage:'File size to big'
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        console.log("FIELDs - ",fields);
        console.log("FILE - ",file);

        //* Save To DB
        product.save((error, savedProduct) => {
        
            if(error){
                return res.status(400).json({
                    status:'fail',
                    message:'updation of product failed',
                    error
                });
            }
            
            res.status(200).json({
                status:'success',
                savedProduct
            });

        })

    });
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

    Products.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Problem with image',
                err
            });
        }

    });
}

//* updating product sold and stock
exports.updateInventory = (req ,res ,next) => {
    
    let myOperation = req.body.order.products.map(prod => {
        return {
            updateOne:{
                filter:{_id: prod._id},
                update: { $inc: {stock: -prod.count, sold: +prod.count} }
            }
        }
    });

    Products.bulkWrite(myOperation, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Bulk operation failed',
                error:err
            });
        }
        console.log("BULD OPERATION - ", products);
        next();
    });
}

exports.getAllUniqueCategories = (req, res) => {
    Products.distinct('catrgory', {}, (err, category) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'No category found',
                error:err
            });
        }
        res.status(200).json({
            status:'success',
            category
        });

    });
}