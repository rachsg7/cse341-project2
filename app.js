 const path = require('path');
 require('custom-env').env('staging');
 const PORT = process.env.PORT || 5000;

 const express = require('express');
 const mongoose = require('mongoose');
 const session = require('express-session');
 const mongoDBStore = require('connect-mongodb-session')(session);
 const bodyParser = require('body-parser');
 const flash = require('connect-flash');
 const multer = require('multer');

 const User = require('./models/user');

 const MONGO_USER = process.env.DB_USER;
 const MONGO_PASS = process.env.DB_PASS;

 const MONGODB_URL = "mongodb+srv://" + MONGO_USER + ":" + MONGO_PASS + "@cluster0.2scof.mongodb.net/pictournal"

 const store = new mongoDBStore({
     uri: MONGODB_URL,
     collection: 'sessions'
 });

 const fileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, 'images');
     },
     filename: (req, file, cb) => {
         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
     }
 });

 const fileFilter = (req, file, cb) => {
     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
         cb(null, true);
     } else {
         cb(null, false);
     }
 };

 const app = express();

 app.set('view engine', 'ejs');
 app.set('views', 'views');

 const mainRouter = require('./routes/main');
 const userRouter = require('./routes/user');
 const authRouter = require('./routes/auth');

 app.use(bodyParser.urlencoded({
     extended: false
 }));
 app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use('/images', express.static(path.join(__dirname, 'images')));
 app.use(
     session({
         secret: 'my secret',
         resave: false,
         saveUninitialized: false,
         store: store
     })
 );

 app.use(flash());

 app.use((req, res, next) => {
     res.locals.isAuthenticated = req.session.isLoggedIn;
     next();
 });

 app.use((req, res, next) => {
     if (!req.session.user) {
         return next();
     }
     User.findById(req.session.user._id)
         .then(user => {
             if (!user) {
                 return next();
             }
             req.user = user;
             next();
         })
         .catch(err => {
             console.log(err);
         });
 });

 app.use(mainRouter);
 app.use(userRouter);
 app.use(authRouter);

 // Logging the rejected field from multer error
 //  app.use((error, req, res, next) => {
 //      console.log('This is the rejected field ->', error.field);
 //  });

 mongoose
     .connect(MONGODB_URL)
     .then(result => {
         app.listen(PORT);
     })
     .catch(err => {
         console.log(err);
     });