/*
Attempt loading env files
*/
require('dotenv').config();
const mg = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();// Uncomment below if you are exposing contents of a directory
const formidable = require('express-formidable');
const formData = require("express-form-data");


// const path = require('path');
const reqIp = require('request-ip');
const throng = require('throng');
const os = require('os');
const logger = require('mlar')('mongolog');
const scrubber = require('mlar')('obscrub');
const appConfig = require('./config/app');
// Uncomment if you want to use Sequelize models
// const models = require('./models/sequelize');
const SCRUBVALS = require('./utils/scrubvals.json');
const apiScaffoldRoutes = require('./routes/api/scaffold');
const apiEventsRoutes = require('./routes/events');
const apiAuthRoutes = require('./routes/auth');
const apiRemindersRoutes = require('./routes/reminders');

function startApp() {
  const app = express();
  const EndpointRouter = express.Router();

  // Uncomment if you need to expose contents of a directory
  // to be served directly via HTTP
  // app.use(express.static(path.join(__dirname, 'public')));
  //* ***********//

  if (process.env.MONGODB_URI) {
    const mgConnectOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    mg.connect(process.env.MONGODB_URI, mgConnectOptions);
    // const db = mg.connection;
  }

  app.use(formData.parse({}));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


  // Handle cases where invalid JSON data is passed
  app.use((err, req, res, next) => {
    // 'entity.parse.failed'
    if (err.type === 'entity.parse.failed') {
      // console.error('Bad JSON');
      // console.dir(err);
      res.json({
        error: true,
        code: '11',
        message: `invalid JSON '${err.body}' passed`,
      });
    } else {
      next();
    }
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, requestId',
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const bodyReqId = req.body.requestId;
    const queryReqId = req.query.requestId;
    const headerReqId = req.headers.requestid;
    const defaultReqId = `NOREQID${Math.ceil(Date.now() + Math.random() * 98984328)}`;
    const reqId = bodyReqId || queryReqId || headerReqId || defaultReqId;
    // Need this so response can have the value for logging as well
    const scrubs = SCRUBVALS;
    res.appLevelRequestId = reqId;
    // res._$vnbreqid = reqid;
    const reqLog = {
      protocol: req.protocol,
      host: req.get('host'),
      endpoint: req.baseUrl + req.path,
      ip: reqIp.getClientIp(req),
      method: req.method,
      body: scrubber(req.body, scrubs),
      query: scrubber(req.query, scrubs),
      headers: scrubber(req.headers, scrubs),
      useragent: req.headers['user-agent'],
    };
    logger({
      type: 'request',
      id: reqId,
      comment: 'Request',
      data: reqLog,
    });
    next();
  });

  app.get('/', (req, res) => {
    res.json({ version: 1.0 });
  });

  const version = '/api/v1';
  app.use(version, apiScaffoldRoutes(EndpointRouter));
  app.use(version, apiEventsRoutes(EndpointRouter));
  app.use(version, apiAuthRoutes(EndpointRouter));
  app.use(version, apiRemindersRoutes(EndpointRouter));
  app.use(version, (req, res) => {
    res.json({ m: `Undefined / Unimplemented ${req.method} ${req.path} route access` });
  });


  // Comment out the below when you want to use models
  app.listen(appConfig.port, () => {
    // runWorker();
    console.log([appConfig.name, 'is running on port', appConfig.port.toString()].join(' '));
  });

  // Uncomment the below when you want to use models
  // const forceSync = !!process.env.FORCESYNC;
  // models.sequelize.sync({ force: forceSync }).then(() => {
  //   app.listen(appConfig.port, () => {
  //     // runWorker();
  //     console.log([appConfig.name, 'is running on port', appConfig.port.toString()].join(' '));
  //   });
  // });
}

/**
 * If you wish to use throng to leverage
 * the available cpu cores, ensure the environment variable
 * USETHRONG is set
 */
if (process.env.USETHRONG) {
  const throngWorkers = process.env.THRONGWORKERS || os.cpus().length;
  throng(throngWorkers, startApp);
} else {
  startApp();
}
