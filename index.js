const express = require("express");
const users = require("./MOCK_DATA.json");
var bodyParser=require("body-parser");
const app = express();
const port = 4000;
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

// In-memory data store
let posts = [
  {
    id: 1,
    userid:3,
    title: "What is Lorem Ipsum?",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcoDecentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Lorem paul",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    userid:5,
    title: "TNisl nisi scelerisques",
    content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id nibh tortor id aliquet lectus proin nibh. Id donec ultrices tincidunt arcu non. Molestie at elementum eu facilisis. ",
    author: "williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    userid:10,
    title: "Dignissim diam",
    content:"Magna eget est lorem ipsum dolor sit amet. Urna id volutpat lacus laoreet non curabitur gravida arcu. Nunc scelerisque viverra mauris in aliquam sem.",
     author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware


//Write your code here//


//CHALLENGE 1: GET All posts

app.get("/getposts",(req,res)=>{
  let userid = parseInt(req.query.userid);
  let userposts = [];
  posts.forEach(v=>{
    if (v.userid === userid){
      userposts.push(v);
    }  
  })
  //console.log(posts);
  res.json(userposts);
});

//CHALLENGE 2: GET a specific post by id

app.get("/posts/:id/",(req,res)=>{

  const id = parseInt(req.params.id);
  const foundBlog = posts.find((blog)=>blog.id===id);
  if(!foundBlog){
    return res.status(404).json({ message: "Post not found" });
  }
  else{
    res.json(foundBlog); 
  }
});

//CHALLENGE 3: POST a new post

app.post("/newpost",(req,res)=>{
  const newId = posts.length+1;
  const newPost={
    id : newId,
    userid:parseInt(req.body.userid),
    title : req.body.title,
    author : req.body.author,
    content:req.body.content,
    date : new Date(),
  };
    
  posts.push(newPost);
  res.status(201).send();
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter

app.post("/editposts/:id/",(req,res) => {
  let userid = req.body.userid;
  const foundBlog = posts.find((blog)=>blog.id===parseInt(req.params.id));
  if(!foundBlog){
    return res.status(404).json({ message: "Post not found" });
  }
  if(foundBlog.userid != userid){
    return res.status(404).json({ message: "Post not found" });
  }
  if(req.body.title){
    foundBlog.title = req.body.title;
  }
  if(req.body.author){
    foundBlog.author = req.body.author;
  }
  if(req.body.content){
    foundBlog.content = req.body.content;
  }
  console.log(foundBlog);
  res.json(foundBlog);
});

//CHALLENGE 5: DELETE a specific post by providing the post id.

app.post("/deleteposts/:id/",(req,res)=>{
  const foundIndex = posts.findIndex((blog)=>blog.id === parseInt(req.params.id));
  if(foundIndex===-1)
  {
    return res.status(404).json({ message: "Post not found" });
  }
  else if( req.body.userid != posts[foundIndex].userid){
    return res.status(404).json({ message: "Post not found" });
  }
  else{
    posts.splice(foundIndex, 1);
    res.json({ message: "Post deleted" });
  }

});


// app.get("/posts", authenticateCRUD, (req, res) => {
//   // Render your blog posts page
//   // res.render("index", { posts: posts });
//   res.json(posts);

// });



// app.post("/login",authenticateToken,(req,res)=>{
//   var token = jwt.sign({userid:"1"},secretekey);
//   res.cookie('user', token);
//   res.render("index",{posts:posts});
// });





app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
