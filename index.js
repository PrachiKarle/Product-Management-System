var express = require("express");
const app = express();
var mysql = require("mysql");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));



//mysql connection
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejssql",
  port: "3306",
});
conn.query((err, data) => {
  if (err) console.log(err);
  console.log(data);
});



var util = require("util");
var exe = util.promisify(conn.query).bind(conn);


//Add products
app.get("/", (req, res) => {
  res.render("home.ejs");
});




//create  insert
app.post("/products", async (req, res) => {
  //create
  // var sql=`create table products(
  // id int AUTO_INCREMENT PRIMARY KEY,
  // name varchar(100),
  // category varchar(50),
  // price DECIMAL(10,2),
  // stock int
  // )`;
  // res.send(sql);

  //insert
  try{
    var a = req.body;
    var sql = `insert into products(name,category,price,stock) values('${a.prod_name}','${a.prod_category}','${a.prod_price}','${a.stock}')`;
    await exe(sql);
    // res.send(sql);
    res.redirect("/products");
  }
  catch(err)
  {
    console.log(err);
  }

});



//read
app.get("/products", async (req, res) => {
  try{
    var sql = `select* from products`;
    var data = await exe(sql);
      // res.send(data);
    const obj = { data: data };
    res.render("product_data.ejs", obj);
  }
  catch(err){
    console.log(err);
  }
});




//delete
app.get('/delete_product/:id',async(req,res)=>{
  try{
    var id=req.params.id;
    var sql=`Delete from products where id=${id}`
    // res.send(sql);
    await exe(sql);
    res.redirect('/products');
  }
  catch(err){
    console.log(err);
  }
    
})




//update -  get product data
app.get('/edit_product/:id',async (req,res)=>{
  try{
    var id=req.params.id;
    var sql=`select* from products where id=${id}`;
    // res.send(sql);
    var d=await exe(sql);
    const obj={data:d[0]};
    res.render('edit_product.ejs',obj);
    // res.send(id);
  }
    catch(err){
      console.log(err);
    }
})

//update - update product data
app.post('/update_product',async(req,res)=>{
  try{
    // res.send(req.body);
    const {prod_id,prod_name,prod_category,prod_price,stock}=req.body;

    var sql=`update products set name='${prod_name}',category='${prod_category}',price='${prod_price}',stock='${stock}' where id=${prod_id}`
    // res.send(sql);
    await exe(sql);
    res.redirect('/products');
  }
  catch(err){
    console.log(err);
  }
})



//server start
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
