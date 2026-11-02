import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/database-connection.js';
import feedbackRoutes from './routes/feedback-routes.js';
import handleApiError from './middleware/error-handler.js';

dotenv.config();

const app = express();
const serverPort = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/feedback', feedbackRoutes);
app.use(handleApiError);

async function startFeedbackServer() {
  try {
    await connectDatabase();

    app.listen(serverPort, () => {
      console.log(`Feedback API is listening on port ${serverPort}`);
    });
  } catch (error) {
    console.error('Could not start the feedback API:', error.message);
    process.exit(1);
  }
}

startFeedbackServer();
