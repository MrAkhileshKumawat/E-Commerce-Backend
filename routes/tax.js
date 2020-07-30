module.exports = (tax,knex,isverify)=>{
    tax.get("/",isverify,(customerData,req,res,next)=>{
        knex.select("*").from("tax")
        .then((tax)=>{
            if(tax.length){
                res.send(tax)
            }
        })
    })


    tax.get("/:tax_id",isverify,(customerData,req,res,next)=>{
        knex("tax").where("tax_id",req.params.tax_id)
        .then((data)=>{
            if(data.length){
                res.send(data)
            }else{
                res.send({message:"Invalid Tax Id"})
            }
            
        })
    })
}