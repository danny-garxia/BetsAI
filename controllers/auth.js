const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrpt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME


    
}); 

exports.signUp = (req,res) =>{
    console.log(req.body);

    const{name,email, password,confrimPassword} = req.body;

    db.query('SELECT email FROM users WHERE email = ?',[email], async (error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0 ) {
            return res.render('signUp',{
                message: "Email is already in use!"
            });
        } 
        else if(password !== confrimPassword) {
            return res.render('signUp',{
                message: "Passwords Do not match"
            });
        }
    
        let hashPass = await bcrpt.hash(password,12);
        console.log(hashPass);

        db.query('INSERT INTO users SET ? ', {name: name, email: email,  password: hashPass}, (err, results) => {
            if(error){
                console.log(error);
            }
            else{
                return res.render('signUp', {
                    message: 'User Created Successfully!'
                })
            }
        })
    });



}

