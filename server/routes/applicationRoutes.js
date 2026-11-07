const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get(
  '/myapplications',
  protect,
  authorize('jobseeker'),
  getMyApplications
);

router.get(
  '/job/:jobId',
  protect,
  authorize('employer'),
  getJobApplications
);


router.post(
  '/:jobId',
  protect,
  authorize('jobseeker'),
  upload.single('resume'),
  applyForJob
);

router.put(
  '/:id/status',
  protect,
  authorize('employer'),
  updateApplicationStatus
);

router.get('/:id', protect, getApplicationById);

module.exports = router;