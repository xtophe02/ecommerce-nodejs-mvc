const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const csrfProtection = csrf();

//FOLDER NAME WHERE TO COPY THE IMAGES
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
//FILTER JPG/PNG/JPEG
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//SET EJS TEMPLATES ON FOLDER VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//PARSE BODY FROM HTML
app.use(express.urlencoded({ extended: false }));

//MIDLEWARE TO STORAGE FILES IN DISK
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
//MIDDLEWARE FIX STATIC PATHS FOR CSS AND JS FILES
app.use(express.static(path.join(__dirname, 'public')));
//MIDDLEWARE FIX STATIC PATHS IMAGES
app.use('/images', express.static(path.join(__dirname, 'images')));

//MIDDLEWARE TO START AND SAVE SESSIONS ON DATABASE
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);
// MIDDLEWARE TO PROTECT FROM CSRF ATTACKS (to avoid session stealing, so we add a token to be sure that the request are legits)
app.use(csrfProtection);
//MID TO ADD NOTIOFICATIONS
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//MID TO ADD USER ON REQ
app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

//ALL EXISTING ROUTES
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//ROUTES ERROR PAGES
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

//INIT MONGODB AND APP LISTENS
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => app.listen(process.env.PORT))
  .catch((err) => console.log(err));
