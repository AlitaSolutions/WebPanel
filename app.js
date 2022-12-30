const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routeify = require('./debug/route');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/api', apiRouter);
routeify(app);
module.exports = app;
