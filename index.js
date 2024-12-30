
require ('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./config/connection')

const pCServer = express()

pCServer.use(cors())
pCServer.use(express.json())
pCServer.use(router)
pCServer.use('/uploads',express.static('./uploads'))
const PORT = 3000 || process.env.PORT

pCServer.listen(PORT,()=>{
    console.log(`Podcast App server started at port : ${PORT} and waiting for client request`);
    
})

pCServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:red">Server started and waiting for client </h1>`)
})


