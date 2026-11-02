import express from 'express';
import {
  createFeedback,
  getFeedback,
  updateFeedbackStatus,
} from '../controllers/feedback-controller.js';

const feedbackRouter = express.Router();

feedbackRouter
  .route('/')
  .post(createFeedback)
  .get(getFeedback);

feedbackRouter.patch('/:id', updateFeedbackStatus);

export default feedbackRouter;