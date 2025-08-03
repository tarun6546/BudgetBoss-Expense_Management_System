const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/connectDb');
//config dot env file
dotenv.config();

//database connection
connectDb();

//rest of the objects
const app = express();

///middlewares
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // Set this in Vercel environment variables
    ];

    // Allow all Vercel domains
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For development, allow localhost with any port
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

//routes
//user routes
app.use('/api/users/v1', require('./routes/userRoute'));
//transaction routes
app.use('/api/users/v1', require('./routes/transactionRoutes'));
//budget routes
app.use('/api/users/v1', require('./routes/budgetRoutes'));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Expanse Management System</h1>');
});

//port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgBlue.white);
});