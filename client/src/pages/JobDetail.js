import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaBuilding,
  FaArrowLeft,
} from "react-icons/fa";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const JobDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch job details
  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/jobs/${id}`);
      setJob(data);
    } catch (err) {
      setError("Job not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // Format salary
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) {
      return "Not specified";
    }

    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }

    if (salary.min) {
      return `From $${salary.min.toLocaleString()}`;
    }

    if (salary.max) {
      return `Up to $${salary.max.toLocaleString()}`;
    }

    return "Not specified";
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Jobs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-blue-100 text-lg">{job.company}</p>
            </div>

            <span className="px-4 py-2 rounded-full text-sm font-medium capitalize bg-white bg-opacity-20 text-white">
              {job.jobType}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaDollarSign />
              <span>{formatSalary(job.salary)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaClock />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>

            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>

            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.requirements}
            </p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.applicationDeadline && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 font-medium">
                ⏰ Application Deadline: {formatDate(job.applicationDeadline)}
              </p>
            </div>
          )}

          {/* About Company */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <FaBuilding className="mr-2 text-blue-600" />
              About the Company
            </h2>

            <p className="text-gray-600">
              {job.postedBy?.company?.description ||
                "No company description available."}
            </p>

            {job.postedBy?.company?.website && (
              <a
                href={job.postedBy.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Visit Website →
              </a>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex justify-center">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Login to Apply
              </Link>
            )}

            {isAuthenticated && isJobSeeker && (
              <Link
                to={`/jobs/${job._id}/apply`}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Apply Now →
              </Link>
            )}

            {isAuthenticated && !isJobSeeker && (
              <p className="text-gray-500">Employers cannot apply for jobs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
