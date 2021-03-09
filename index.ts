import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'
import { log } from 'console'

const app = express()
app.use(bodyParser.json())
app.use(cors())
const fs = require('fs')

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"
const saltRounds = 10;

let users=[
   { 
   id:1,
   username: "ktnnn3",
   password: "1234",
   firstname:"Kittinun",
   lastname:"Taweeboon",
   balance:"100"
}
]

interface JWTPayload {
  username: string;
  password: string;
}

app.post('/login',
  (req, res) => {

    const { username, password } = req.body
    //const {users}= JSON.parse(fs.readFileSync('./users.json',{encoding:"utf-8"}));  
    // Use username and password to create token.
    const successful = users.find((user)=>user.username === username && bcrypt.compareSync(password, user.password))
    if(successful){
      const token = jwt.sign({ 
        id: successful.id, 
        username: successful.username,
        // firstname:successful.firstname, 
        // lastname:successful.lastname, 
        // balance:successful.balance 
      }, SECRET)
      res.status(200).json({
        message: 'Login succesfully',
        token
      });
    }else{
      res.status(400).json({
        message: "Invalid username or password",
      });

    }
    res.end()
    // return res.status(200).json({
    //   message: 'Login succesfully',
    // })
  })

app.post('/register',
  (req, res) => {

    const { username, password, firstname, lastname, balance } = req.body
    //const file = JSON.parse(fs.readFileSync('./users.json',{encoding:"utf-8"})); 
    //const {users} = file;
    const existUser = users.find((user) => user.username === username)
    if (existUser) {
      //nothing
      res.status(400).json({
        message: "Username is already in used"
      })
  } else {
      res.status(200).json({
        message:"Register successfully"

      })
      let lastperson = 1
      if (users.length > 0) {
          lastperson = users[users.length - 1].id + 1;
      }
      //add

      const encryptpass = bcrypt.hashSync(password, saltRounds);

      const newUser = {
          id: lastperson,
          username,
          password:encryptpass ,
          firstname,
          lastname,
          balance,

          //password: encryptpass,
      }
      users.push(newUser);
      res.json(newUser)


  }})


app.get('/balance',
  (req, res) => {
    // const {users}= JSON.parse(fs.readFileSync('./users.json',{encoding:"utf-8"}));
    //const token = req.query.token as string
    const token = req.headers.authorization;
    if(token){
      try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
      res.json({
        username
    })
    console.log(username);
    
      
    }
    catch (e) {
      //response in case of invalid token
      res.json({message:"Invalid token"})
    }
    }
    //const {users }= JSON.parse(fs.readFileSync('./users.json',{encoding:"utf-8"}));  
    res.json(users);
    
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {
    const { amount } = req.body
    const updatemoney = amount
    if(validationResult(req)){
      res.status(200).json({
        message:"Deposit successfully",
        balance: updatemoney
      })
    }
    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
    else{
      res.json({
        message:"Invalid token"
      })
    }
  })

app.post('/withdraw',
  (req, res) => {
    const { amount } = req.body
    const token = req.headers.authorization;

    if(token){
      const user = jwt.verify(token, SECRET)
      const updatemoney = amount
      res.status(200).json({
        message:"Withdraw successfully",
        balance: updatemoney
      })
    }
    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
    else{
      res.json({
        message:"Invalid token"
      })
    }

  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  //const file = JSON.parse(fs.readFileSync('./users.json',{encoding:"utf-8"})); 
  //const {users} = file;
  //file.users=[]
  users = []
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  //const token = req.headers.authorization;
    //if (token) {
        //do something
        //validate token...
        //try {
            //const user = jwt.verify(token, SECRET)
            res.status(200).json({
              firstname: "Kittinun",
              lastname : "Taweeboon",
              code : "620610772",
              gpa : "3.55",          
            })
    //     } catch (error) {
    //         res.json({ message: "Invalid token" })

    //     }

    // } else {
    //     res.json({ message: "missing token" })
    // }
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})


app.listen(PORT, () => console.log(`Server is running at ${PORT}`))