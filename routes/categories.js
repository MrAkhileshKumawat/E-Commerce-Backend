module.exports = (categories , knex)=>{
    categories.get("/",(req,res,next)=>{
        knex.select().from("category")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    categories.get("/:category_id",(req,res,next)=>{
        knex("category").where("category_id",req.params.category_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    categories.get("/inProduct/:product_id",(req,res)=>{
        knex
        .select("category.category_id","department_id","name")
        .from("category")
        .join("product_category","category.category_id", "=", "product_category.category_id")
        .where('product_category.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    categories.get("/inDepartment/:department_id",(req,res)=>{
        knex.select("category.category_id","category.name","category.description","department.department_id")
        .from("category")
        .join("department","category.department_id", "=", "department.department_id")
        .where('department.department_id',req.params.department_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
}

