import express, { Express } from 'express';
import MyRouters from './routers';

const app: Express = express();

app.use(express.urlencoded({ extended: true }));

// in another file
MyRouters(app);

app.listen(3000, () => console.log(`I'm listening on port 3000!`));
