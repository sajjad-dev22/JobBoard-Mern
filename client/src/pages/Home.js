import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import api from "../utils/api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (jobType) params.append("jobType", jobType);

      params.append("page", page);
      params.append("limit", 9);

      const { data } = await api.get(`/api/jobs?${params.toString()}`);

      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, location, jobType, page]);

  // Fetch jobs when page or job type changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Search jobs
  const handleSearch = (e) => {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
    } else {
      fetchJobs();
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Job
          </h1>

          <p className="text-blue-100 text-lg mb-10">
            Thousands of jobs from top companies. Start your search today.
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto shadow-lg"
          >
            <div className="flex items-center flex-1 border border-gray-200 rounded-xl px-4 py-2">
              <FaSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, keywords..."
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            <div className="flex items-center flex-1 border border-gray-200 rounded-xl px-4 py-2">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-gray-600 font-medium flex items-center">
            <FaBriefcase className="mr-2" /> Filter:
          </span>

          {[
            "",
            "full-time",
            "part-time",
            "contract",
            "internship",
            "remote",
          ].map((type) => (
            <button
              key={type}
              onClick={() => {
                setJobType(type);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                jobType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {type === "" ? "All Jobs" : type}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-gray-500 mb-6">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {pagination.total || 0}
            </span>{" "}
            jobs
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <Spinner />}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* No Jobs */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-16">
            <FaBriefcase className="text-gray-300 text-6xl mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-gray-500">
              No jobs found
            </h3>

            <p className="text-gray-400 mt-2">
              Try different search terms or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
