import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function CompletionPieChart({
  weekPercentage,
  monthPercentage,
  yearPercentage,
}) {

  const values = [
    {
      label: 'This Week',
      percentage: weekPercentage || 0,
      color: '#0d6efd',
    },
    {
      label: 'This Month',
      percentage: monthPercentage || 0,
      color: '#20c997',
    },
    {
      label: 'This Year',
      percentage: yearPercentage || 0,
      color: '#fd7e14',
    },
  ];

  const total = values.reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  const centerX = 150;
  const centerY = 150;
  const radius = 115;

  const polarToCartesian = (
    centerX,
    centerY,
    radius,
    angle
  ) => {

    const angleInRadians =
      ((angle - 90) * Math.PI) / 180;

    return {
      x:
        centerX +
        radius * Math.cos(angleInRadians),

      y:
        centerY +
        radius * Math.sin(angleInRadians),
    };
  };

  const createSlicePath = (
    startAngle,
    endAngle
  ) => {

    const start =
      polarToCartesian(
        centerX,
        centerY,
        radius,
        endAngle
      );

    const end =
      polarToCartesian(
        centerX,
        centerY,
        radius,
        startAngle
      );

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? 0
        : 1;

    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  let currentAngle = 0;

  return (
    <div className="completion-pie-container">

      <div className="completion-pie-chart">

        {total === 0 ? (

          <svg
            viewBox="0 0 300 300"
            width="300"
            height="300"
          >

            <circle
              cx="150"
              cy="150"
              r="115"
              fill="#e9ecef"
              stroke="#ffffff"
              strokeWidth="3"
            />

            <text
              x="150"
              y="158"
              textAnchor="middle"
              fill="#6c757d"
              fontSize="24"
              fontWeight="700"
            >
              0%
            </text>

          </svg>

        ) : (

          <svg
            viewBox="0 0 300 300"
            width="300"
            height="300"
          >

            {values.map((item) => {

              if (item.percentage <= 0) {
                return null;
              }

              const sliceAngle =
                (item.percentage / total) * 360;

              const startAngle =
                currentAngle;

              const endAngle =
                currentAngle + sliceAngle;

              const midAngle =
                startAngle +
                sliceAngle / 2;

              currentAngle = endAngle;

              const textPosition =
                polarToCartesian(
                  centerX,
                  centerY,
                  72,
                  midAngle
                );

              return (
                <g key={item.label}>

                  <path
                    d={createSlicePath(
                      startAngle,
                      endAngle
                    )}
                    fill={item.color}
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  <text
                    x={textPosition.x}
                    y={textPosition.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize="17"
                    fontWeight="700"
                  >
                    {item.percentage}%
                  </text>

                </g>
              );
            })}

          </svg>

        )}

      </div>


      {/* Legend */}

      <div className="completion-pie-legend">

        {values.map((item) => (

          <div
            className="legend-item"
            key={item.label}
          >

            <span
              className="legend-dot"
              style={{
                backgroundColor: item.color,
              }}
            />

            <div>

              <strong>
                {item.label}
              </strong>

              <small>
                {item.percentage}% completed
              </small>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

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

          {/* Total Interviews */}

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


          {/* Scheduled */}

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


          {/* Completed */}

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


          {/* Selected */}

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


          {/* Rejected */}

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


          {/* On Hold */}

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


        {/* Completed Interview Percentage */}

        <div className="card shadow-sm mb-4">

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