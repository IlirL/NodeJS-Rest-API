import express from 'express'
const app = express()
import morgan from 'morgan'
import mysql from 'mysql'
// import router from './routes/user.js'

import bodyParser from 'body-parser'

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static('../frontend'));

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
    const firstName = req.body.create_first_name;
    const lastName = req.body.create_last_name

    const queryString = "INSERT INTO users_table (first_name, last_name) VALUES (?, ?)";
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if(err)
        {
            console.log("Failed to uinsert new user: " + err )
            res.sendStatus(500)
            return
        }
        console.log("INserted a new user");
        res.end();
    })

    res.end();
})

// const router = require('./routes/user.js')
// app.use(router);
app.get("/users", (req, res) => {
    // var user1 = {firstName: "Stephen", lastName: "Curry"}
    // var user2 = {firstName: "Kevin", lastName: "Durant"}
    // res.json([user1, user2])
    
    const connection = getConnection();

    const queryString = "SELECT * FROM users_table";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            console.log("Failed to query users: " + err);
            res.sendStatus(500);
            return;
        }
        else
        res.json(rows);
    })
    // res.send("Nodemon auto aupdates when I save this file")
})

function getConnection(){
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password: "password",
        database: "users" //come back here for any problem
    })
}

app.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    // connection.connect(function(err) {
    //     if(err) console.log( err);
    //     else
    //     {
    //         console.log("Connected")
    //     }
    // })


    const userId = req.params.id;
    const queryString = `SELECT * FROM users_table WHERE id = ${userId}`

    connection.query(queryString, (err, rows, fields) => {
       
       if(err){
           console.log("Failed to query for user: " + err)
           res.sendStatus(500)
           return
       }
       
       
        console.log("I think we fetched users succesfully");
        // console.log(rows)
         res.json(rows)

    })

    //  res.end();
})

app.get("/", (req, res) => {
    console.log("Responding to root route");
    res.send("Hello from ROOOOOT")
})


app.listen(8001, () => {
    console.log("Server is running on port 8001");
})