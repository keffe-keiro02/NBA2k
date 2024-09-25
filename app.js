const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Blog = require("./models/blog");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const dbURI = "mongodb+srv://admin:admin123@cluster0.ibcxo.mongodb.net/nodejs-app?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to db");
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/news", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("news", { blogs: result, title: "News" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/games", (req, res) => {
  res.render("games", { title: "Games" });
});


app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.post("/blogs", urlencodedParser, (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body
  });

  blog
    .save()
    .then((result) => {
      res.redirect("/news");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/news" });
    })
    .catch((err) => {
      console.log(err);
    });
});


app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
