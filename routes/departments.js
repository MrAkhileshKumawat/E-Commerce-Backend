module.exports   = (departments , knex)=>{
    departments.get("/",(req,res)=>{
        knex.select().from("department")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    departments.get("/:id",(req,res)=>{
        var id = req.params.id
        knex("department").where("department_id",id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

}