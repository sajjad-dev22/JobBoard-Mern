import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa';

const JobCard = ({ job }) => {

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not specified';
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    if (salary.min) return `From $${salary.min.toLocaleString()}`;
    if (salary.max) return `Up to $${salary.max.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getJobTypeBadgeColor = (jobType) => {
    const colors = {
      'full-time':  'bg-green-100 text-green-800',
      'part-time':  'bg-yellow-100 text-yellow-800',
      'contract':   'bg-purple-100 text-purple-800',
      'internship': 'bg-blue-100 text-blue-800',
      'remote':     'bg-pink-100 text-pink-800',
    };
    return colors[jobType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p className="text-blue-600 font-medium mt-1">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getJobTypeBadgeColor(job.jobType)}`}>
          {job.jobType}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaDollarSign className="text-gray-400" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaClock className="text-gray-400" />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-gray-400 text-xs py-1">+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Posted by {job.postedBy?.name || 'Employer'}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;