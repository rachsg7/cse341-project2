 const path = require('path');
 require('custom-env').env('staging');
 const PORT = process.env.PORT || 5000;

 const express = require('express');
 const mongoose = require('mongoose');
 const session = require('express-session');
 const mongoDBStore = require('connect-mongodb-session')(session);
 const bodyParser = require('body-parser');
 const flash = require('connect-flash');

 const MONGO_USER = process.env.MONGO_USER;
 const MONGO_PASS = process.env.MONGO_PASS;

 const MONGODB_URL = "mongodb+srv://" + MONGO_USER + ":" + MONGO_PASS + "@cluster0.2scof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

 const app = express();

 app.set('view engine', 'ejs');
 app.set('views', 'views');

 const mainRouter = require('./routes/main');
 const userRouter = require('./routes/user');
 const authRouter = require('./routes/auth');

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use(
     session({
         secret: 'my secret',
         resave: false,
         saveUninitialized: false,
     })
 );
 app.use(flash());

 app.use(mainRouter);
 app.use(userRouter);
 app.use(authRouter);

 mongoose
     .connect(MONGODB_URL)
     .then(result => {
         app.listen(PORT);
     })
     .catch(err => {
         console.log(err);
     });