const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Dodaj import cors

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/uploads/avatars', express.static('uploads/avatars'));

// Dodaj middleware CORS przed zdefiniowanymi trasami API
app.use(cors());

// Dodaj trasę dla głównej ścieżki
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
