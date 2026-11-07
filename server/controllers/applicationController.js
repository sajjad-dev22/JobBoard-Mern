const Application = require('../models/Application');
const Job = require('../models/Job');

// ============ APPLY FOR JOB ============
// @route POST /api/applications/:jobId
// @access Private (Job Seekers only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (!job.isActive) {
      res.status(400);
      return next(new Error('This job is no longer accepting applications'));
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }

    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload your resume'));
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resumeUrl: req.file.path,
    });

    await application.populate('job', 'title company');
    await application.populate('applicant', 'name email');

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// ============ GET MY APPLICATIONS ============
// @route GET /api/applications/myapplications
// @access Private (Job Seekers only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// ============ GET APPLICATIONS FOR A JOB ============
// @route GET /api/applications/job/:jobId
// @access Private (Employers only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to view these applications'));
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email profile')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// ============ UPDATE APPLICATION STATUS ============
// @route PUT /api/applications/:id/status
// @access Private (Employers only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employerNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this application'));
    }

    application.status = status || application.status;
    application.employerNotes = employerNotes || application.employerNotes;

    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// ============ GET SINGLE APPLICATION ============
// @route GET /api/applications/:id
// @access Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location')
      .populate('applicant', 'name email profile');

    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    const job = await Job.findById(application.job._id);
    const isApplicant =
      application.applicant._id.toString() === req.user._id.toString();
    const isEmployer = job.postedBy.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      res.status(403);
      return next(new Error('Not authorized to view this application'));
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
};