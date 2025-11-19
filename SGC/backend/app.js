import express from 'express';
import router from './routes/candidatura.routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.use(bodyParser.json());
app.use(express.static('frontend'));

// routes
app.use('api', router );


export default app;