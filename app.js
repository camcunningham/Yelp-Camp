const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const Comment = require('./models/comment');
const seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message));
seedDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(express.static(__dirname + '/public'));

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
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
})

// NEW - Show the form for adding new campsites
app.get('/campgrounds/new', (req,res) => {
  res.render('campgrounds/new');
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
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
      // Render the show template with that information
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });

});

// ===========================================
// COMMENTS ROUTES
// ===========================================

app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comment', (req,res) => {
  //Lookup campground using the id
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      //Create the new comment
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          console.log(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  })
});

app.listen(3000, () => {
  console.log('YelpCamp server has started');
});
