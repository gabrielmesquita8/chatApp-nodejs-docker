import express from 'express';
import 'express-async-errors'
import router from './routes/UserRouter';
import 'reflect-metadata';
import { errorMiddleware } from './middleware/error';
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(router);

app.use(errorMiddleware)

app.listen(3000)

export default app