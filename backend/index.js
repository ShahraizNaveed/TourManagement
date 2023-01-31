import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import tourRouter from './routes/tours.js'
import userRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import reviewRouter from './routes/reviews.js'
import bookingRouter from './routes/bookings.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
    origin: true,
    credentials: true
}

// For Testing 

// app.get('/', (req, resp) => {
// resp.send('Api is Working')
// })


// For Database Connection
mongoose.set("strictQuery", false)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('MongoDB database Connected');
    } catch (error) {
        console.log('MongoDB database connection failed');
    }
}


// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/booking', bookingRouter)


app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running at Port : ${PORT}`);
})