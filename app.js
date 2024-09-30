// if(process.env.NODE_ENV !== "production") {
//   require('dotenv').config();
// }
process.env.NODE_ENV === 'production';
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users');
const walkRoutes = require('./routes/walks');
const reviewRoutes = require('./routes/reviews');
const homehubRoutes = require('./routes/homehubs');

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/peakyblogger';

mongoose.connect(db_url)//('mongodb://localhost:27017/peakyblogger')
  .then(() => console.log('Mongo Connection Open'))
  .catch((err) => { console.log('Oh no Mongo Connection Error'); console.log(err); });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => { console.log('Database connected'); });



app.engine('ejs', ejsMate); // ONE OF MANY ENGINES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // PARSES BODY
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize()); // {replaceWith: '_'} CAN ADD THIS HERE

const secret = process.env.SECRET || 'Ilikeorangepeel';

const store = MongoStore.create({
  mongoUrl: db_url,
  secret,
  touchAfter: 24*60*60
});

store.on('error', function(e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000*60*60*24*7, 
    maxAge: 1000*60*60*24*7 }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ })); // { contentSecurityPolicy: false }

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://ka-f.fontawesome.com/",
];
const fontSrcUrls = [
  "https://ka-f.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/future-source/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
              "https://media.istockphoto.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
}); //BEFORE ROUTE HANDLERS

app.use('/', userRoutes);
app.use('/', homehubRoutes);
app.use('/walks', walkRoutes);
app.use('/walks/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode=500 } = err;
  if(!err.message) err.message = 'Oh dear something went wrong!!!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});