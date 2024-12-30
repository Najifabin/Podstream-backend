const mongoose = require('mongoose')
const connection_string = process.env.CONNECTIONSTRING

mongoose.connect(connection_string).then((res)=>{
    console.log("Mongodb atlas connected succesfully with pCserver");
    
}).catch(err=>{
    console.log("Mongodb atlas connection failed");
    console.log(err);
    
    
})