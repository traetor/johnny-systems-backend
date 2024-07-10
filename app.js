const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Dodaj import cors
const { Pool } = require('pg'); // Dodaj import Pool z pg

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/uploads/avatars', express.static('uploads/avatars'));

// Ustawienie opcji dla CORS
const corsOptions = {
    origin: '*', // Możesz dostosować do konkretnego origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

// Dodaj middleware CORS przed zdefiniowanymi trasami API
app.use(cors(corsOptions));

// Połączenie z bazą danych PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // W przypadku używania SSL
    }
});

// Endpoint do testowania połączenia z bazą danych
app.get('/test-db-connection', async (req, res) => {
    try {
        const client = await pool.connect();
        client.release();
        res.send('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Error connecting to the database');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager App');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
