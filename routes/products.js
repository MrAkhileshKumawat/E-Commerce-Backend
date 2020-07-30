module.exports = (products , knex ,jwt , secret_key , isverify)=>{
    products.get("/",(req,res)=>{
        knex.select(
            "product_id",
            "name",
            "description",
            "price",
            "discounted_price",
            "thumbnail")
        .from('product')
        .then((data)=>{
            res.send({count:data.length,rows:data})
        }).catch((err)=>{
            res.send(err)
        })
    })

    products.get('/search',(req, res)=>{
        var query_string = req.query.query_string;
        console.log(req.query.query_string);
        knex
        .select(
            'product_id',
            "name",
            "description",
            "price",
            "discounted_price",
            "thumbnail")
        .from('product')
        .where('name','like','%' + query_string)
        .orWhere('name','like', query_string + '%')
        .orWhere('description','like','%'+ query_string + '%')
        .orWhere('name',query_string)
        .then((product)=>{
            res.send({count:product.length,rows:product})
        }).catch((err)=>{
            res.send(err)
        })
    });


    products.get("/:product_id",(req,res,next)=>{
        knex("product").where("product_id",req.params.product_id)
        .then((product)=>{
            if(product.length){
                res.send(product)
            }else{
                next (err = new Error("Product with this ID is not available") , err.status = 404)
            }
        }).catch((err)=>{
            res.send(err)
        })
    })


    products.get("/inCategory/:category_id",(req,res)=>{
        knex.select(
            "product_category.product_id",
            "name",
            "description",
            "price",
            "discounted_price",
            "thumbnail")
            .from("product")
            .join("product_category","product.product_id","=","product_category.product_id")
            .where("category_id",req.params.category_id)
            .then((product)=>{
                res.send({count:product.length,rows:product})
            }).catch((err)=>{
                res.send(err)
            })
    })

    
    products.get("/inDepartment/:department_id",(req,res)=>{
        knex
        .select(
            "product.product_id",
            "product.name",
            "product.description",
            "product.price",
            "product.discounted_price",
            "product.thumbnail")
        .from("product")
        .join("product_category","product.product_id","=","product_category.product_id")
        .join("category","product_category.category_id","category.category_id")
        .where("department_id",req.params.department_id)
        .then((product)=>{
            res.send({count:product.length,rows:product})
        }).catch((err)=>{
            res.send(err)
        })
    })



    products.get("/:product_id/details",(req,res,next)=>{
        knex("product").where("product_id",req.params.product_id)
        .then((product)=>{
            if(product.length){
                delete product[0].thumbnail , delete product[0].display
                res.send(product)
            }else{
                next (err = new Error("Product with this ID is not available") , err.status = 404   ) 
            }
        }).catch((err)=>{
            res.send(err)
        })
    })


    products.get("/:product_id/locations",(req,res,next)=>{
        knex
        .select("category.category_id","category.name as category_name","department.department_id","department.name as department_name")
        .from("product_category")
        .join("category","product_category.category_id","=","category.category_id")
        .join("department","category.department_id","=","department.department_id")
        .where("product_id",req.params.product_id)
        .then((productLocation)=>{
            if(productLocation.length){
                res.send(productLocation)
            }else{
                next (err = new Error("Product with this ID is not available") , err.status = 404   ) 
            }
        }).catch((err)=>{
            res.send(err)
        })

    })


    products.post("/:product_id/reviews",isverify,(customerData,req,res,next)=>{
        customer_review = req.body
        var query ={"customer_id":customerData.customer_id,"product_id":req.params.product_id}
        if(req.body.review !== undefined && req.body.rating!==undefined){
            knex("review").where(query)
            .then((review)=>{
                if(review.length){
                    var updated_review = {
                        review:req.body.review,
                        rating:req.body.rating,
                        created_on:new Date
                    }
                    knex("review").where(query)
                    .update(updated_review)
                    .then(()=>{
                        res.send({message:"review updated successfully"})
                    })
                }else{
                    customer_review["customer_id"]=customerData.customer_id,
                    customer_review["product_id"]=req.params.product_id
                    customer_review["created_on"]=new Date

                    knex("review").insert(customer_review)
                    .then(()=>{
                        res.send({message:"Review added successfully"})
                    })
                }
            }).catch((err)=>{
                res.send(err)
            })
            
        }else{
            res.send("Please fill review and rating")
        }
    });



    products.get("/:product_id/review",(req,res,next)=>{
        knex.select("name","review","rating","created_on")
        .from("customer")
        .join("review","customer.customer_id","=","review.customer_id")
        .where("product_id",req.params.product_id)
        .then((reviews)=>{
            res.send(reviews)
        }).catch((err)=>{
            res.send(err)
        })
    })

}