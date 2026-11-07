import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import api from '../utils/api';

const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/applications/myapplications');
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:     'bg-yellow-100 text-yellow-800',
      reviewed:    'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      rejected:    'bg-red-100 text-red-800',
      accepted:    'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'accepted') return <FaCheckCircle className="text-green-500" />;
    if (status === 'rejected') return <FaTimesCircle className="text-red-500" />;
    return <FaClock className="text-yellow-500" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1">Track all your job applications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['pending', 'reviewed', 'shortlisted', 'accepted'].map((status) => (
          <div key={status} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {applications.filter((a) => a.status === status).length}
            </p>
            <p className="text-sm text-gray-500 capitalize mt-1">{status}</p>
          </div>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
          <FaBriefcase className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">No applications yet</h3>
          <p className="text-gray-400 mt-2">Start applying for jobs!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium inline-block mt-6"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    {getStatusIcon(app.status)}
                    <h3 className="font-semibold text-gray-900 text-lg">{app.job?.title}</h3>
                  </div>
                  <p className="text-blue-600 font-medium">{app.job?.company}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <span>{app.job?.location}</span>
                    <span className="capitalize">{app.job?.jobType}</span>
                    <span>Applied: {formatDate(app.createdAt)}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">{app.coverLetter}</p>
                </div>

                <div className="ml-4 flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <Link to={`/jobs/${app.job?._id}`} className="text-blue-600 text-sm hover:underline">
                    View Job
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;