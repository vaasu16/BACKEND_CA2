import mongoose from 'mongoose';
import feedbackModel from '../models/feedback-schema.js';

export async function createFeedback(req, res, next) {
  try {
    const { studentName, courseName, message, rating } = req.body || {};

    const newFeedback = new feedbackModel({
      studentName,
      courseName,
      message,
      rating,
    });

    const savedFeedback = await newFeedback.save();
    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: savedFeedback,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getFeedback(req, res, next) {
  try {
    const pageNumber = req.query.page === undefined ? 1 : Number(req.query.page);
    const recordsPerPage =
      req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(recordsPerPage) ||
      pageNumber < 1 ||
      recordsPerPage < 1
    ) {
      return res.status(400).json({
        message: 'Page and limit must be positive integers',
      });
    }

    const firstRecordIndex = (pageNumber - 1) * recordsPerPage;
    const totalRecords = await feedbackModel.countDocuments();
    const feedbackRecords = await feedbackModel.find()
      .skip(firstRecordIndex)
      .limit(recordsPerPage);

    return res.status(200).json({
      feedback: feedbackRecords,
      currentPage: pageNumber,
      totalRecords,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateFeedbackStatus(req, res, next) {
  try {
    const feedbackId = req.params.id;
    const { status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({
        message: 'Invalid feedback ID',
      });
    }

    if (status !== 'Pending' && status !== 'Reviewed') {
      return res.status(400).json({
        message: 'Status must be Pending or Reviewed',
      });
    }

    const updatedFeedback = await feedbackModel.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        message: 'Feedback record not found',
      });
    }

    return res.status(200).json({
      message: 'Feedback status updated successfully',
      feedback: updatedFeedback,
    });
  } catch (error) {
    return next(error);
  }
}