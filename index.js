const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/postRoutes');
const connectDB = require('./config/db');
const { login } = require('./contollers/postController');

const PORT = process.env.PORT || 8000;
const app = express();

dotenv.config();
connectDB();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello, App is working');
});

app.use('/api/v1/user', userRoutes);
app.post('/api/v1/login', login);

app.listen(PORT, () => console.log(`Server is up and running at ${PORT}`));
