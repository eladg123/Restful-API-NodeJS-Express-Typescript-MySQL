import http from 'http';
import express, { application } from 'express'
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config'
import bookRoutes from './routes/book';
            
const NAMESPACE = 'Server';
const router = express();

/** Logging the request */
router.use((req,res,next)=>{
      logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`)
      res.on('finish',()=>{
              logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`)
      })
      next();
})


router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


/** Rules of our API */
router.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
})


/** Routes */
router.use('/books',bookRoutes);

/** Error handling */
router.use((req,res,next)=>{
    const error = new Error('Not found');
    return res.status(404).json({message: error.message}) 
})


/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port,()=>{
    logging.info(NAMESPACE, `Server running on ${config.server.hostname} : ${config.server.port}`)
})