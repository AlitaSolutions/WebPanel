const express = require('express');
const path = require('path');
const logger = require('morgan');
const routeify = require('./debug/route');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/auth.middleware');
const apiRouter = require('./routes/api');
const db = require('./db');
const app = express();

async function setup(){
    await db.connection('mongodb://127.0.0.1:27017/panel');
    await db.setup();
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/admin', authMiddleware, adminRouter);
    app.use('/api', apiRouter);
    app.use('/', authRouter);
    routeify(app);
}
setup();
module.exports = app;
