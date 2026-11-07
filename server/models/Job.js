const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      required: [true, 'Job type is required'],
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    skills: [String], 
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);


jobSchema.index({ title: 'text', description: 'text', company: 'text' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;