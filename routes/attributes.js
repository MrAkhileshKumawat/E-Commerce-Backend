module.exports = (attributes,knex)=>{
    attributes.get("/",(req,res)=>{
        knex("attribute")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    attributes.get("/:attribute_id",(req,res)=>{
        knex("attribute").where("attribute_id",req.params.attribute_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    
    attributes.get("/values/:attribute_id",(req,res)=>{
        knex.select("attribute_value_id","value")
        .from("attribute")
        .join("attribute_value","attribute.attribute_id","=","attribute_value.attribute_id")
        .where("attribute_value.attribute_id",req.params.attribute_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })



    attributes.get("/inProduct/:product_id",(req,res)=>{
        knex.select("name as attribute_name","attribute_value.attribute_value_id","value as attribute_value")
        .from("attribute")
        .join("attribute_value","attribute.attribute_id","=","attribute_value.attribute_id")
        .join("product_attribute","attribute_value.attribute_value_id","=","product_attribute.attribute_value_id")
        .where("product_id",req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    
}