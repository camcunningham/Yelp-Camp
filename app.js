const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
   extended: true
}));

// Temporary global data in place of a database
let campgrounds = [
  {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pb_5302236"},
  {name: "Granite Hill", image: "https://www.photosforclass.com/download/px_1061640"},
  {name: "Mountain Goat Ranch", image: "https://www.photosforclass.com/download/pb_4817872"}
];

// Routes
app.get("/", (req,res) => {
  res.render("landing");
});

app.get("/campgrounds", (req,res) => {
  res.render("campgrounds", {campgrounds: campgrounds});
})

app.get("/campgrounds/new", (req,res) => {
  res.render("new");
});

app.post("/campgrounds", (req,res) => {
  // Get data from the form
  const name = req.body.name
  const image = req.body.image

  const newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  //Redirect back to the campgrounds page
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("YelpCamp server has started");
});
