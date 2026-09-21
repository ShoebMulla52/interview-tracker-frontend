import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/dashboard/stats');

      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('DASHBOARD ERROR:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to load dashboard'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-container">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted">
            Loading dashboard...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div className="page-container">
          <div className="alert alert-danger">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchDashboardStats}
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-container">

        {/* Dashboard Header */}
        <div className="mb-4">
          <h2 className="page-title">
            Dashboard
          </h2>

          <p className="page-subtitle">
            Overview of your interview activities
          </p>
        </div>

        {/* Existing Interview Status Cards */}
        <div className="row g-4 mb-4">

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  Total Interviews
                </div>

                <h2>
                  {stats?.totalInterviews ?? 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  Scheduled
                </div>

                <h2>
                  {stats?.scheduled ?? 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  Completed
                </div>

                <h2>
                  {stats?.completed ?? 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  Selected
                </div>

                <h2>
                  {stats?.selected ?? 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  Rejected
                </div>

                <h2>
                  {stats?.rejected ?? 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  On Hold
                </div>

                <h2>
                  {stats?.onHold ?? 0}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Interview Activity */}
        <div className="mb-3">
          <h4 className="fw-bold mb-1">
            Interview Activity
          </h4>

          <p className="text-muted mb-0">
            Number of interviews based on interview date
          </p>
        </div>

        <div className="row g-4 mb-4">

          {/* This Week */}
          <div className="col-md-4">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  This Week
                </div>

                <h2>
                  {stats?.thisWeek ?? 0}
                </h2>

                <p className="text-muted mb-0 mt-2">
                  Interviews
                </p>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="col-md-4">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  This Month
                </div>

                <h2>
                  {stats?.thisMonth ?? 0}
                </h2>

                <p className="text-muted mb-0 mt-2">
                  Interviews
                </p>
              </div>
            </div>
          </div>

          {/* This Year */}
          <div className="col-md-4">
            <div className="card dashboard-card shadow-sm h-100">
              <div className="card-body">
                <div className="dashboard-card-title">
                  This Year
                </div>

                <h2>
                  {stats?.thisYear ?? 0}
                </h2>

                <p className="text-muted mb-0 mt-2">
                  Interviews
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">
              Quick Actions
            </h5>
          </div>

          <div className="card-body">

            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => navigate('/interviews/add')}
            >
              Add Interview
            </button>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate('/interviews')}
            >
              View All Interviews
            </button>

          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;