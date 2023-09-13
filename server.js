const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios")
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(cookieParser());
const port = 3000;
const API_URL = "http://localhost:4000";


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const users = require("./MOCK_DATA.json");
const secretekey = "dffsdfdvsdfdgvgvsdfdb";

function authenticateToken(req, res, next) {

    var loggeduser = req.cookies.user;
    if(loggeduser){
      jwt.verify(loggeduser, secretekey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = parseInt(user.id);
        next();
        });
    }
    else{
        var token = req.token;
        if (!token) {
        // return res.status(401).json({ message: 'Unauthorized' });
        res.redirect("/login");
        }
    
        jwt.verify(token, secretekey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = parseInt(user.id);
        next();
        });
    }
  }

 
 
app.get("/",(req,res)=>{
  if(req.cookies.user){
    res.redirect("/showposts");
  }
  else{
    res.redirect("/login");
  }
})

  app.get("/login",(req,res)=>{
    
    res.render("login");
  });

  app.post("/login" ,(req, res) => {
    f_name = req.body.first_name;
    l_name = req.body.last_name;
    email = req.body.email;
    var found_user = null;
    for (let i = 0; i < users.length; i++) {
      const element = users[i];
      if(element.email === email && element.last_name === l_name){
        found_user = element;
        break;
      }
    }
    if(found_user === null){
      res.send("User not found");
    }
    var token = jwt.sign(found_user,secretekey);
    
    res.cookie('user', token);
    res.redirect("/showposts");
  });
  

// Route to render the main page
app.get("/showposts",authenticateToken, async (req, res) => {
  let id  = req.user;
  try {
    const response = await axios.get(`${API_URL}/getposts?userid=${id}`);
    //console.log(response);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Route to render the edit page
app.get("/new",authenticateToken, (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id",authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts",authenticateToken, async (req, res) => {
  try {
    req.body.userid = req.user;
    const response = await axios.post(`${API_URL}/newpost`,req.body,
    {headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }},  
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id",authenticateToken, async (req, res) => {
  try {
    let userid = req.user;
    req.body.userid = userid;
    const response = await axios.post(
      `${API_URL}/editposts/${req.params.id}`,
      req.body,{headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }},
    );
   console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Delete a post
app.get("/api/posts/delete/:id",authenticateToken, async (req, res) => {
  try {
    let userid = req.user;
    await axios.post(`${API_URL}/deleteposts/${req.params.id}`,{"userid":userid},
    {headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }},
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.get("/logout",authenticateToken,(req,res)=>{
  res.clearCookie("user");
  res.redirect("/login");
})

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
