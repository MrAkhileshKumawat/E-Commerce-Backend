module.exports = (shipping,knex,isverify)=>{
    shipping.get("/regions",isverify,(customerData,req,res,next)=>{
        knex.select("*").from("shipping_region")
        .then((shipping_region)=>{
            res.send(shipping_region)
        }).catch((err)=>{
            res.send(err)
        })
    })


    shipping.get("/regions/:shipping_region_id",isverify,(customerData,req,res,next)=>{
        knex.select("*").from("shipping")
        .where("shipping_region_id",req.params.shipping_region_id)
        .then((shippingDetail)=>{
            if(shippingDetail.length){
                res.send(shippingDetail)
            }else{
                res.send({message:"Invalid shipping Id"})
            }
        })
    })

}