const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);

// ⚠️ IMPORTANT: /employer/myjobs MUST come BEFORE /:id
// Otherwise Express matches 'employer' as the :id parameter
router.get('/employer/myjobs', protect, authorize('employer'), getMyJobs);

router.get('/:id', getJobById);

// Private routes
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;