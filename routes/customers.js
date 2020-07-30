module.exports = (customers,customer,knex,secret_key,jwt,isverify)=>{
    customers.post("/",(req,res,next)=>{
        knex("customer").insert({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }).then(()=>{
            res.send({success:"User signup successfully"})
        }).catch((err)=>{
            next(err = new Error("User already exists"))
        })
    })


    customers.post("/login",(req,res,next)=>{
        if(req.headers.cookie !== undefined){
            res.cookie("jwt","logoutPrvious",{maxAge:0})
        }
        knex("customer").havingIn("email",req.body.email)
        .then((user)=>{
            if(user.length){
                var user = user[0]
                if(user.password==req.body.password){
                    var customerData={
                        customer_id:user.customer_id,
                        name:user.name,
                        email:user.email,
                        password:user.password
                    }
                    let token = jwt.sign(customerData,secret_key)
                    res.cookie("jwt",token)
                    res.send("Login Success")
                }else{
                    next(err = new Error("Your password is incorrect "),err.status = 401)
                }
            }else{
                next(err = new Error("Cannot Found User"),err.status = 404)
            }  
        }).catch((err)=>{
            res.send(err)
        })
    })


    customer.put("/",isverify,(customerData,req,res,next)=>{
        // console.log(customerData)
        var updated_customer = {
            "name": req.body.name,
            "email":req.body.email,
            "password": req.body.password,
            "day_phone":req.body.day_phone,
            "eve_phone": req.body.eve_phone,
            "mob_phone": req.body.mob_phone
        }
        knex("customer").where("email",customerData.email).update(updated_customer)
        .then(()=>{
            res.send({message:"Customer detail updated"})
        }).catch((err)=>{
            next(err)
        })
    });


    customers.put("/address",isverify,(customerData,req,res,next)=>{
        var updated_address = {
            "address_1":req.body.address_1,
            "address_2":req.body.address_2,
            "city": req.body.city,
            "region":req.body.region,
            "postal_code":req.body.postal_code,
            "country":req.body.country,
            "shipping_region_id":req.body.shipping_region_id
        }
    
        knex("customer").where("email",customerData.email).update(updated_address)
        .then(()=>{
            res.send("Customer address updated")
        }).catch((err)=>{
            next(err)
        })
    })

    customers.put("/creditCard",isverify,(customerData,req,res,next)=>{
        var updated_creditcard = {
            credit_card:req.body.credit_card
        }
        knex("customer").where("email",customerData.email).update(updated_creditcard)
        .then(()=>{
            return res.send("Customer address updated")
        }).catch((err)=>{
            next(err)
        })
    })


    customer.get("/",(req,res,next)=>{
        var token = req.headers.cookie
        if(token!==undefined){
            jwt.verify(token.slice(4),secret_key,(err, customerData)=>{
                knex("customer").where("customer_id",customerData.customer_id)
                .then((user)=>{
                    delete user[0].password
                    res.send(user)
                }).catch((err)=>{
                    res.send(err)
                })
            })
        }else{next(err = new Error("Login Please"))}
    })


    customer.post("/logout",(req,res)=>{
        res.cookie('jwt',"logout", {maxAge: 0});
        res.send("logged out")

    })

}