import express, { Express } from 'express';
import { userRoute } from './routes/userRoute';

const app : Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', userRoute);

app.listen(3000, () => console.log("Listening to port 3000"));