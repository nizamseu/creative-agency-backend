const express =require('express');
const bodyParser =require('body-parser');
const cors =require('cors');
const fileUpload = require('express-fileupload');
const fs=require('fs-extra')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const { read } = require('fs/promises');
const uri = "mongodb+srv://creative:creative@cluster0.r2lzi.mongodb.net/creativeAgency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});



const app =express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port=5000;


client.connect(err => {
    const servicesCollection = client.db("creativeAgency").collection("services");
    const orderCollection= client.db("creativeAgency").collection("orders");
    const reviewCollection= client.db("creativeAgency").collection("review");
    const adminCollection= client.db("creativeAgency").collection("admin");
 
    app.post('/addservice',(req,res)=>{
    const file=req.files.file;
    const title=req.body.title;
    const description= req.body.description;
    const newImage=file.data;
    const encImg=newImage.toString('base64');

    const image={
        contentType:file.mimetype,
        size:file.size,
        img:Buffer.from(encImg,'base64')
    }
   if(file.size<1000001)
        {
            servicesCollection.insertOne({title,description,image})
            .then(result=>{
            res.send({message: 'inserted'})
            })
        }
    else{
        // res.send("file Size have to be less than 1MB");
        res.status(404).send( {message: 'file Size have to be less than 1MB'});
    }
  })
  ;
//  app.get('/order',(req,res)=>{
//   servicesCollection.find({})
//   .toArray((err,document)=>{
//     res.send(document)
//   })
//  })
  
app.get('/services',(req,res)=>{
    servicesCollection.find({}).sort({_id:-1}).limit(3)
    .toArray((error,document)=>{
        res.send(document)
    })
});

app.get('/findservice/:id',(req,res)=>{
const id=req.params.id
  servicesCollection.find({_id:ObjectID(id)}).sort({_id:-1})
  .toArray((error,document)=>{
      res.send(document)
  })
});



app.post('/order',(req,res)=>{
  const data=req.body
  orderCollection.insertOne(data)
  .then(result=>{
    res.send(result.insertedCount>0)
  })

});

app.get('/servicelist/:email',(req,res)=>{
  const email= req.params.email;
  orderCollection.find({email:email})
  .toArray((err,document)=>{
    res.send(document)
  })
});

app.post('/addreview',(req,res)=>{
  const review=req.body
  reviewCollection.insertOne(review)
  .then(result=>{
    res.send(result.insertedCount>0)
  })
});


app.get('/findReview',(req,res)=>{
  reviewCollection.find({}).sort({_id:-1})
  .toArray((err,document)=>{
    res.send(document)
  })
});


app.get('/orderList',(req,res)=>{
  orderCollection.find({}).sort({_id:-1})
  .toArray((err,document)=>{
    res.send(document)
  })
});


app.patch('/action',(req,res)=>{
  const id=req.body.id;
  const value=req.body.actionValue;
  if(id && value){
    orderCollection.updateOne({_id:ObjectID(id)},{
      $set:{actionType:value}
  })
  .then(result=>{
      res.send(result.modifiedCount>0)
  })
  }
  });


  app.post('/addAdmin',(req,res)=>{
    const email=req.body
    adminCollection.insertOne(email)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  app.get('/findAdmin/:email',(req,res)=>{

    const email= req.params.email;
    adminCollection.find({email:email})
    .toArray((err,document)=>{
      res.send(document.length>0)
    })
  });
  

  console.log("connected");
    // client.close();
  });



app.listen(process.env.PORT || port)