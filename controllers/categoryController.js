const Category = require('./../models/category');

exports.getCategoryById = (req, res, next, cId) => {
     
    Category.findById(cId).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                status:'fail',
                message:'Category Not Found',
                error:err
            });
        }
        console.log("GET CATEGORY BY ID", category);
        req.category = category;
        next();
    })      

}

exports.createCategory = (req, res) => {
   
    //* My code
    // try{
    //     const category = await Category.create(req.body);
        
    //     res.status(200).json({
    //         status:"success",
    //         category
    //     });

    // }catch(err){
    //     res.status(404).json({
    //         status:'fail',
    //         message:'Could not save category in DB',
    //         error:err
    //     });
    // }


    //* Hitesh sir code
    
    const category = new Category(req.body);
    category.save((err, cate) => {
        if(err){
            return res.status(400).json({
                status:'fail',
                message:'Could not save category in DB',
                error:err
            });
        }
        res.status(200).json({
            status:'success',
            cate
        });
    });
    
}

exports.getCategory = (req, res) => {
    res.status(200).json({
        status:'success',
        category: req.category
    });
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err || !categories){
            return res.status(400).json({
                status:'fail',
                message:'Category not found',
                error:err
            });
        }
        res.status(200).json({
            status:'success',
            categories
        });
    });
}

exports.updateCategory =  (req, res) => {
  
    //* My Code
    // Category.findByIdAndUpdate(
    //     {_id:req.category._id},
    //     {$set: req.body},
    //     {new: true},
    //     (err, updatedCategory) => {
    //         if(err){
    //             return res.status(404).json({
    //                 status:'fail',
    //                 message:'You are not authorized to update',
    //                 error:err
    //             });
    //         }
           
    //         res.status(200).json({
    //             status:'success',
    //             updatedCategory
    //         });

    //     }
    // );

    //* Hitesh sir code
   
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
        return res.status(400).json({
            error: "Failed to update category"
        });
        }
        res.status(200).json({
            status:'success',
            updatedCategory
        });
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;

    category.remove((err, deletedCategory) => {
            if(err || category === null){
                return res.status(400).json({
                    status:'fail',
                    message:'Failed to delete this category',
                    error:err
                });
            }
            res.status(200).json({
                status:'success',
                message:`successfully deleted '${deletedCategory.name}' Category`
            });
    })
}
