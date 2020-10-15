'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import fileUpload from 'express-fileupload';
import { PORT } from './constant';
import  db from './../models';
import initRoutes from './routes/index';
import swagger from './swagger';
// Create a new express application instance
const startApp = async() => {
  try {
    const app: express.Application = express();
    const server = http.createServer(app);
    app.use(bodyParser.json({
      limit: '2mb',
    }));
    app.use(bodyParser.urlencoded({
      limit: '2mb',
      extended: true,
    }));
    app.all('*', (req:any, res:any, next:any) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'POST, GET, PUT,PATCH, DELETE');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if ('OPTIONS' === req.method) return res.status(200).send();
      next();
    });
    app.use(fileUpload());
    app.use('/public', express.static(path.join(__dirname, './../', 'public')));
    app.use('/docs', swagger.router);
    initRoutes(app);
    const eraseDatabaseOnSync = false;
    await db.sequelize.sync({ force : eraseDatabaseOnSync });
    server.listen(PORT);
    console.log(`RESTful API server started on: ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startApp();
