const Job = require('../models/Job');

// ============ CREATE JOB ============
// @route POST /api/jobs
// @access Private (Employers only)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      jobType,
      salary,
      skills,
      applicationDeadline,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      company: req.user.company.name || 'Company Name',
      location,
      jobType,
      salary,
      skills: skills || [],
      applicationDeadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// ============ GET ALL JOBS ============
// @route GET /api/jobs
// @access Public
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      jobs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============ GET SINGLE JOB ============
// @route GET /api/jobs/:id
// @access Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name email company'
    );

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// ============ UPDATE JOB ============
// @route PUT /api/jobs/:id
// @access Private (Job owner only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this job'));
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// ============ DELETE JOB ============
// @route DELETE /api/jobs/:id
// @access Private (Job owner only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this job'));
    }

    await job.deleteOne();

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ GET MY JOBS ============
// @route GET /api/jobs/employer/myjobs
// @access Private (Employers only)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};