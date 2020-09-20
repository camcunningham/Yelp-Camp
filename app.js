const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
   extended: true
}));

// const Campground = mongoose.model('Campground', campgroundSchema)

// Routes
app.get('/', (req,res) => {
  res.render('landing');
});

// INDEX - Show all campgrounds
app.get('/campgrounds', (req,res) => {
  // Get all campgrounds from db
  Campground.find({}, (err, campgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {campgrounds: campgrounds});
    }
  });
})

// NEW - Show the form for adding new campsites
app.get('/campgrounds/new', (req,res) => {
  res.render('new');
});

// CREATE - Create new campsites in db
app.post('/campgrounds', (req,res) => {
  // Get data from the form
  const name = req.body.name
  const image = req.body.image
  const description = req.body.description;
  const newCampground = {name: name, image: image, description: description};

  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      //Redirect back to the campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// SHOW - Shows more info about a single campsite
app.get('/campgrounds/:id', (req,res) => {
  // Find the campground with the provided id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      // Render the show template with that information
      res.render('show', {campground: foundCampground});
    }
  });

});

app.listen(3000, () => {
  console.log('YelpCamp server has started');
});
