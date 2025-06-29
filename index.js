import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => {
    res.send("Hello Word")
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});