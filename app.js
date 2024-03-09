const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({path: './.env'})

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));  //Serve static files from

//Parse URL-encoded bodies (this is default
app.use(express.urlencoded({ extended: false }));

app.use(express.json());       // Parse JSON bodies

app.set('view engine', 'hbs');

db.connect((error) =>{
    if(error){
        console.log(error);
    }
    else{
        console.log('connected to the server');
    }
})

app.use('/',require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000 , ()=>{
console.log("Server started on port 3000");
})