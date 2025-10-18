import express from 'express';
import {
  syncQuestions,
  getQuestions,
  getQuestionBySlug,
  getTopics,
  getStats
} from '../controllers/questionsController';

const router = express.Router();

// Get database stats
router.get('/stats', getStats);

// Sync questions from LeetCode API
router.post('/sync', syncQuestions);

// Get all questions with filtering
router.get('/', getQuestions);

// Get all unique topics
router.get('/topics', getTopics);

// Get a single question by slug
router.get('/:slug', getQuestionBySlug);

export default router;
