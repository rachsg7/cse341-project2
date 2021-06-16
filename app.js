 const path = require('path');
 require('custom-env').env('staging');
 const PORT = process.env.PORT || 5000;

 const express = require('express');
 const bodyParser = require('body-parser');

 const app = express();

 app.set('view engine', 'ejs');
 app.set('views', 'views');

 const mainRouter = require('./routes/main');
 const userRouter = require('./routes/user')

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, 'public')));

 app.use(mainRouter);
 app.use(userRouter);


 app.listen(PORT);