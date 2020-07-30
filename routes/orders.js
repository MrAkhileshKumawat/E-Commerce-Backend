module.exports = (orders,knex,isverify)=>{
    //Example for request body
    /*`{
    	"cart_id" : "2slkvmfw9ww",
    	"shipping_id" : 3,
    	"tax_id" : 1
    }`*/
    orders.post("/",isverify,(customerData,req,res,next)=>{
        var order = req.body
        var CartId = req.body.cart_id
        if((order.cart_id&&order.shipping_id&&order.tax_id)!==undefined && order!=={}){
            order["customer_id"]=customerData.customer_id
            var date = new Date
            order["created_on"]=date
            knex.select("product.product_id","attributes","name as product_name","quantity","price as unit_cost").from("shopping_cart")
            .join("product","shopping_cart.product_id","=","product.product_id")
            .where("cart_id",order.cart_id)
            .then((products)=>{
                if(products.length){
                    total_Amount=0
                    for(product of products){
                        total_Amount+=Number(product.unit_cost)*Number(product.quantity)
                    }
                    order["total_amount"]=total_Amount
                    delete order.cart_id
                    knex("orders").insert(order)
                    .then(()=>{
                        // console.log(date)
                        knex.select("order_id").from("orders")
                        .where("customer_id",customerData.customer_id)
                        .then((order_id)=>{
                            order_id=order_id.length
                            for(order_detail of products){
                                order_detail["order_id"]=order_id
                            }
                            
                            knex("order_detail").insert(products)
                            .then(()=>{
                            
                                knex("shopping_cart").where("cart_id",CartId)
                                .del()
                                .then(()=>{
                                    res.send({orderId:order_id})
                                }).catch((err)=>{
                                    res.send(err)
                                })
                            }).catch(((err)=>{
                                res.send(err)
                            }))
                            
                        }).catch((err)=>{
                            res.send(err)
                        })
                    }).catch((err)=>{
                        res.send(err)
                    })

                }else{res.send({message:"your cart is empty"})}
                // res.send(products)
            }).catch((err)=>{
                res.send(err)
            })
        }else{
            res.send({message:"Fill all the details"})
        }
    });

    

    orders.get("/inCustomer",isverify,(customerData,req,res,next)=>{
        knex("orders").join("order_detail","orders.order_id","=","order_detail.order_id")
        .where("customer_id",customerData.customer_id)
        .select("orders.order_id",
                "created_on",
                "product_id",)
        .then((orders)=>{
            res.send(orders)
           
        }).catch((err)=>{
            res.send(err)
        })
    });


    orders.get("/shortDetail/:order_id",isverify,(customerData,req,res,next)=>{
        knex.select("orders.order_id","total_amount","created_on","status")
        .from("orders").join("order_detail","orders.order_id","=","order_detail.order_id")
        .where({"orders.order_id":req.params.order_id,"customer_id":customerData.customer_id})
        .then((order)=>{
            // console.log(order)
            order[0]["customer_name"]=customerData.name
            if(order.length){
                res.send(order[0])
            }else{
                res.send({message:"you didn't order anything"})
            }
        }).catch((err)=>{
            res.send(err)
        })

    });




    orders.get("/:order_id",isverify,(customerData,req,res,next)=>{
        knex("orders").join("order_detail","orders.order_id","=","order_detail.order_id")
        .where({"customer_id":customerData.customer_id,"orders.order_id":req.params.order_id})
        .select("orders.order_id",
                "product_id",
                "attributes",
                "product_name",
                "quantity",
                "unit_cost")
        .then((data)=>{
            for(i of data){
                i["sub_total"]=Number(i.unit_cost)*Number(i.quantity)
            }
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    });

}