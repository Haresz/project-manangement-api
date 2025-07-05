import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './src/routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;
const routes = router;

app.use(cookieParser());
app.use(express.json());

app.get('/', (_, res) => {
    res.send("Hello Word")
});

app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});