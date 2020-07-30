require("dotenv").config()

const express = require("express")
const app = express()
const knex = require("./dbConnection")
const jwt = require("jsonwebtoken")
const isverify = require("./middleware")
const secret_key = process.env.SECRET_KEY
app.use(express.json())

const departments = express.Router()
app.use("/departments",departments)
require("./routes/departments")(departments,knex)


const categories = express.Router()
app.use("/categories",categories)
require("./routes/categories")(categories,knex)


const attributes = express.Router()
app.use("/attributes",attributes)
require("./routes/attributes")(attributes,knex)


const products = express.Router()
app.use("/products",products)
require("./routes/products")(products,knex,jwt,secret_key,isverify)

const customers = express.Router()
app.use("/customers",customers)

const customer = express.Router();
app.use('/customer',customer);
require('./routes/customers')(customers,customer,knex,secret_key,jwt,isverify)

const orders = express.Router();
app.use("/orders",orders)
require("./routes/orders")(orders,knex,isverify)

const shoppingcart = express.Router();
app.use("/shoppingcart",shoppingcart)
require("./routes/shoppingcart")(shoppingcart,knex,isverify)

const shipping = express.Router();
app.use("/shipping",shipping)
require("./routes/shipping")(shipping,knex,isverify)

const tax= express.Router();
app.use("/tax",tax)
require("./routes/tax")(tax,knex,isverify)



app.use((req , res , next)=>{
    const err = new Error("Not Found")
    err.status = 404;
    next(err)
})

app.use((err , req , res , next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status:err.status || 500,
            message: err.message
        }
    })
})

port = process.env.PORT || 4040
app.listen(port , ()=>{console.log(`server is running on port ${port}`)})