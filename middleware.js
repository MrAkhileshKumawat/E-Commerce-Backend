const jwt = require("jsonwebtoken")
const knex = require("./dbConnection")
secret_key = process.env.SECRET_KEY

const isverfy = (req,res,next)=>{
    var token = req.headers.cookie
    // console.log(token)
    if(token!==undefined){
        jwt.verify(token.slice(4),secret_key,(err , customerData)=>{
            knex("customer").havingIn("email",customerData.email)
            .then((customer_data)=>{
                // console.log(customerData)
                if(customer_data.length){
                    var customerData = customer_data[0]
                    next(customerData)
                
                }else{
                    res.send({message:"User not found"})
                }
            }).catch((err)=>{
                res.send(err)
            })
        })
    }else{
        return res.send({message:"Login Please"})
    }
}


module.exports = isverfy