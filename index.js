const express = require('express')
const cors = require('cors')
const {MongoClient} = require('mongodb')
const bcrypt = require('bcrypt')

const app = new express();
app.use(express.json());
//client is running in port 3000
//any thord part application can be serverd,if the cors is enabled
app.use(cors());

const client = new MongoClient('mongodb+srv://admin1:admin1@cluster0.ysfckn7.mongodb.net/?retryWrites=true&w=majority');
client.connect();
//outer cluster is cluster
//inside cluster is database is collection (which is similar to mysql table)
//inside database is collection (which is similar to mysql table )
//inside collection is document (which is similar to mysql table row or records)
const db = client.db("skill")
const col = db.collection("user")
const col2 = db.collection("category")

//from browser, the default url triggering is get method
//localhost:8081/home
//1st parameter is address and the second parameter is service function
app.get('/home', (req, res)=> {
    res.send("It is a Home Page - New Page - New 2 Page")
})
//1st parameter is address and second parameter is service function
//client send request to server which need to take
app.post('/insert', async (req, res) => {
    //every request will have header and body section
    //req = {header: ...., body: actual_data}
    req.body.password = await bcrypt.hash(req.body.password, 5)
    console.log(req.body);
    col.insertOne(req.body);
    res.send("Data Received")
})

app.post('/check', async (req, res) => {
    console.log(req.body)
    //you can give may key value pairs, every key and value is a condition
    //every key is a database column name which will check for corrending value
    var result = await col.findOne({"name":req.body.un})
    if(result != null) {
        if(await bcrypt.compare(req.body.pw, result.password)) {
            res.send(result);
        }
        else {
            res.send("fail")
        }
    }
    else {
        res.send("fail")
    }
})
app.get('/show', async (req, res) => {
    var result = await col.find().toArray();
    console.log(result);
    res.send(result);



})

app.post('/entry',(req,res) => {
    //var result = await col2.find(). toArray();
    console.log(req.body);
    col2.insertOne(req.body);
    res.send("Successfully Inserted")

})

app.get('/display', async(req,res) => {
    var result = await col2.find().toArray();
    res.send(result);
})

app.delete('/delete', async (req,res) =>{
    console.log(req.body.id);
    await col2.deleteOne({pid:req.query.id});
    res.send("deleted");

})

app.listen(8081);
console.log("Server Running");