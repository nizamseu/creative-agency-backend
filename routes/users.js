var express = require('express');
const cors = require('cors');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://creative:creative@cluster0.r2lzi.mongodb.net/creativeAgency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const userAndPass='creative'
// const db='creativeAgency'
// const collection ='orders'
/* GET users listing. */




client.connect(err => {
  const collection = client.db("creativeAgency").collection("orders");
  // perform actions on the collection object
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addservice',(req,res)=>{
  res.send(req.body)
  console.log(req.body);
})


console.log("connected");
  // client.close();
});



module.exports = router;
