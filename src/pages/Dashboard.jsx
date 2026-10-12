import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

/* =========================================================
   Individual Percentage Circle
   ========================================================= */

function PercentageCircle({
  percentage,
  label,
  color,
  suffix = 'completed',
}) {
  const safePercentage = Math.max(
    0,
    Math.min(100, Number(percentage) || 0)
  );

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference -
    (safePercentage / 100) * circumference;

  return (
    <div className="percentage-circle-item">

      <div className="percentage-circle-wrapper">

        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
        >

          {/* Background Circle */}
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="#e9ecef"
            strokeWidth="10"
          />

          {/* Progress Circle */}
          {safePercentage > 0 && (
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              transform="rotate(-90 55 55)"
            />
          )}

          {/* Percentage Text */}
          <text
            x="55"
            y="55"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill="#212529"
          >
            {safePercentage}%
          </text>

        </svg>

      </div>

      {/* Label */}
      <div className="percentage-circle-label">

        <strong>
          {label}
        </strong>

        <small>
          {safePercentage}% {suffix}
        </small>

      </div>

    </div>
  );
}


/* =========================================================
   Common Percentage Chart
   ========================================================= */

function PercentageChart({
  weekPercentage,
  monthPercentage,
  yearPercentage,
  type = 'completed',
}) {
  return (
    <div className="percentage-chart-container">

      {/* This Week */}
      <PercentageCircle
        percentage={weekPercentage}
        label="This Week"
        color="#0d6efd"
        suffix={type}
      />

      {/* This Month */}
      <PercentageCircle
        percentage={monthPercentage}
        label="This Month"
        color="#20c997"
        suffix={type}
      />

      {/* This Year */}
      <PercentageCircle
        percentage={yearPercentage}
        label="This Year"
        color="#fd7e14"
        suffix={type}
      />

    </div>
  );
}


/* =========================================================
   Completed Interview Percentage
   ========================================================= */

function CompletionPieChart({
  weekPercentage,
  monthPercentage,
  yearPercentage,
}) {
  return (
    <PercentageChart
      weekPercentage={weekPercentage}
      monthPercentage={monthPercentage}
      yearPercentage={yearPercentage}
      type="completed"
    />
  );
}


/* =========================================================
   Selected / Rejected Percentage
   ========================================================= */

function StatusPieChart({
  type,
  weekPercentage,
  monthPercentage,
  yearPercentage,
}) {
  return (
    <PercentageChart
      weekPercentage={weekPercentage}
      monthPercentage={monthPercentage}
      yearPercentage={yearPercentage}
      type={type}
    />
  );
}


/* =========================================================
   Dashboard
   ========================================================= */

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();


  /* =======================================================
     Fetch Dashboard Statistics
     ======================================================= */

  useEffect(() => {
    fetchDashboardStats();
  }, []);


  const fetchDashboardStats = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await api.get('/dashboard/stats');

      setStats(
        response.data.data ||
        response.data
      );

    } catch (error) {

      console.error(
        'DASHBOARD ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to load dashboard'
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     Percentage Calculation
     ======================================================= */

  const getCompletionPercentage = (
    completed,
    total
  ) => {

    if (!total) {
      return 0;
    }

    return Math.round(
      (completed / total) * 100
    );
  };


  /* =======================================================
     Completed Percentages
     ======================================================= */

  const thisWeekPercentage =
    getCompletionPercentage(
      stats?.thisWeekCompleted,
      stats?.thisWeek
    );


  const thisMonthPercentage =
    getCompletionPercentage(
      stats?.thisMonthCompleted,
      stats?.thisMonth
    );


  const thisYearPercentage =
    getCompletionPercentage(
      stats?.thisYearCompleted,
      stats?.thisYear
    );


  /* =======================================================
     Selected Percentages
     ======================================================= */

  const thisWeekSelectedPercentage =
    getCompletionPercentage(
      stats?.thisWeekSelected,
      stats?.thisWeek
    );


  const thisMonthSelectedPercentage =
    getCompletionPercentage(
      stats?.thisMonthSelected,
      stats?.thisMonth
    );


  const thisYearSelectedPercentage =
    getCompletionPercentage(
      stats?.thisYearSelected,
      stats?.thisYear
    );


  /* =======================================================
     Rejected Percentages
     ======================================================= */

  const thisWeekRejectedPercentage =
    getCompletionPercentage(
      stats?.thisWeekRejected,
      stats?.thisWeek
    );


  const thisMonthRejectedPercentage =
    getCompletionPercentage(
      stats?.thisMonthRejected,
      stats?.thisMonth
    );


  const thisYearRejectedPercentage =
    getCompletionPercentage(
      stats?.thisYearRejected,
      stats?.thisYear
    );


  /* =======================================================
     Loading
     ======================================================= */

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


  /* =======================================================
     Error
     ======================================================= */

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


  /* =======================================================
     Dashboard UI
     ======================================================= */

  return (
    <>
      <Navbar />

      <div className="page-container">

        {/* =================================================
            Dashboard Header
            ================================================= */}

        <div className="mb-4">

          <h2 className="page-title">
            Dashboard
          </h2>

          <p className="page-subtitle">
            Overview of your interview activities
          </p>

        </div>


        {/* =================================================
            Existing Interview Status Cards
            ================================================= */}

        <div className="row g-4 mb-4">

          {/* Total Interviews */}

          <div className="col-md-6 col-lg-4">

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


          {/* Scheduled */}

          <div className="col-md-6 col-lg-4">

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


          {/* Completed */}

          <div className="col-md-6 col-lg-4">

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


          {/* Selected */}

          <div className="col-md-6 col-lg-4">

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


          {/* Rejected */}

          <div className="col-md-6 col-lg-4">

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


          {/* On Hold */}

          <div className="col-md-6 col-lg-4">

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


        {/* =================================================
            Interview Activity
            ================================================= */}

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


        {/* =================================================
            Percentage Charts
            ================================================= */}

        <div className="row g-4 mb-4">

          {/* Completed */}

          <div className="col-lg-4">

            <div className="card shadow-sm h-100">

              <div className="card-header">

                <h5 className="mb-1">
                  Completed Interview Percentage
                </h5>

                <small className="text-muted">
                  Percentage of completed interviews
                </small>

              </div>

              <div className="card-body">

                <CompletionPieChart
                  weekPercentage={
                    thisWeekPercentage
                  }
                  monthPercentage={
                    thisMonthPercentage
                  }
                  yearPercentage={
                    thisYearPercentage
                  }
                />

              </div>

            </div>

          </div>


          {/* Selected */}

          <div className="col-lg-4">

            <div className="card shadow-sm h-100">

              <div className="card-header">

                <h5 className="mb-1">
                  Selected Interview Percentage
                </h5>

                <small className="text-muted">
                  Percentage of selected interviews
                </small>

              </div>

              <div className="card-body">

                <StatusPieChart
                  type="selected"
                  weekPercentage={
                    thisWeekSelectedPercentage
                  }
                  monthPercentage={
                    thisMonthSelectedPercentage
                  }
                  yearPercentage={
                    thisYearSelectedPercentage
                  }
                />

              </div>

            </div>

          </div>


          {/* Rejected */}

          <div className="col-lg-4">

            <div className="card shadow-sm h-100">

              <div className="card-header">

                <h5 className="mb-1">
                  Rejected Interview Percentage
                </h5>

                <small className="text-muted">
                  Percentage of rejected interviews
                </small>

              </div>

              <div className="card-body">

                <StatusPieChart
                  type="rejected"
                  weekPercentage={
                    thisWeekRejectedPercentage
                  }
                  monthPercentage={
                    thisMonthRejectedPercentage
                  }
                  yearPercentage={
                    thisYearRejectedPercentage
                  }
                />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            Quick Actions
            ================================================= */}

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
              onClick={() =>
                navigate('/interviews/add')
              }
            >
              Add Interview
            </button>


            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                navigate('/interviews')
              }
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