import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import interviewService from '../services/interviewService';

function InterviewDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await interviewService.getInterviewById(id);

      console.log(
        'INTERVIEW DETAILS:',
        response.data
      );

      setInterview(response.data);

    } catch (error) {

      console.error(
        'INTERVIEW DETAILS ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Unable to load interview details'
      );

    } finally {

      setLoading(false);

    }
  };

  const formatMode = (mode) => {

    if (!mode) {
      return 'N/A';
    }

    if (mode === 'VIRTUAL') {
      return 'Virtual';
    }

    if (mode === 'FACE_TO_FACE') {
      return 'Face to Face';
    }

    return mode;
  };

  const formatStatus = (status) => {

    if (!status) {
      return 'N/A';
    }

    if (status === 'ON_HOLD') {
      return 'On Hold';
    }

    return (
      status.charAt(0) +
      status.slice(1).toLowerCase()
    );
  };

  const getStatusClass = (status) => {

    switch (status) {

      case 'SCHEDULED':
        return 'badge bg-primary';

      case 'COMPLETED':
        return 'badge bg-secondary';

      case 'SELECTED':
        return 'badge bg-success';

      case 'REJECTED':
        return 'badge bg-danger';

      case 'ON_HOLD':
        return 'badge bg-warning text-dark';

      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (date) => {

    if (!date) {
      return 'N/A';
    }

    return new Date(date).toLocaleDateString(
      'en-IN'
    );
  };

  const formatDateTime = (dateTime) => {

    if (!dateTime) {
      return 'N/A';
    }

    return new Date(dateTime).toLocaleString(
      'en-IN'
    );
  };

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="container mt-5 text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3">
            Loading interview details...
          </p>

        </div>
      </>
    );
  }

  if (error) {

    return (
      <>
        <Navbar />

        <div className="container mt-4">

          <div className="alert alert-danger">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate('/interviews')
            }
          >
            Back to Interviews
          </button>

        </div>
      </>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="fw-bold">
              Interview Details
            </h2>

            <p className="text-muted">
              Interview ID: {interview.id}
            </p>

          </div>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-warning"
              onClick={() =>
                navigate(
                  `/interviews/edit/${interview.id}`
                )
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate('/interviews')
              }
            >
              Back
            </button>

          </div>

        </div>

        {/* Basic Information */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              Interview Information
            </h5>
          </div>

          <div className="card-body">

            <div className="row g-4">

              <div className="col-md-6">
                <strong>
                  Candidate Name
                </strong>

                <p className="mb-0 mt-1">
                  {interview.candidateName || 'N/A'}
                </p>
              </div>

              <div className="col-md-6">
                <strong>
                  Company Name
                </strong>

                <p className="mb-0 mt-1">
                  {interview.companyName || 'N/A'}
                </p>
              </div>

              <div className="col-md-6">
                <strong>
                  Interview Supporter
                </strong>

                <p className="mb-0 mt-1">
                  {interview.interviewSupporter || 'N/A'}
                </p>
              </div>

              <div className="col-md-6">
                <strong>
                  Role
                </strong>

                <p className="mb-0 mt-1">
                  {interview.role || 'N/A'}
                </p>
              </div>

              <div className="col-md-4">
                <strong>
                  Interview Date
                </strong>

                <p className="mb-0 mt-1">
                  {formatDate(
                    interview.interviewDate
                  )}
                </p>
              </div>

              <div className="col-md-4">
                <strong>
                  Interview Time
                </strong>

                <p className="mb-0 mt-1">
                  {interview.interviewTime || 'N/A'}
                </p>
              </div>

              <div className="col-md-4">
                <strong>
                  Round
                </strong>

                <p className="mb-0 mt-1">
                  {interview.round || 'N/A'}
                </p>
              </div>

              <div className="col-md-6">
                <strong>
                  Interview Mode
                </strong>

                <p className="mb-0 mt-1">
                  {formatMode(interview.mode)}
                </p>
              </div>

              <div className="col-md-6">
                <strong>
                  Status
                </strong>

                <p className="mb-0 mt-1">

                  <span
                    className={getStatusClass(
                      interview.status
                    )}
                  >
                    {formatStatus(
                      interview.status
                    )}
                  </span>

                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Feedback */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              Feedback
            </h5>
          </div>

          <div className="card-body">

            <p className="mb-0">
              {interview.feedback ||
                'No feedback added.'}
            </p>

          </div>

        </div>

        {/* Remarks */}

        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              Remarks
            </h5>
          </div>

          <div className="card-body">

            <p className="mb-0">
              {interview.remarks ||
                'No remarks added.'}
            </p>

          </div>

        </div>

        {/* Audit Information */}

        <div className="card shadow-sm">

          <div className="card-header">
            <h5 className="mb-0">
              Record Information
            </h5>
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-6">

                <strong>
                  Created At
                </strong>

                <p className="mb-0 mt-1">
                  {formatDateTime(
                    interview.createdAt
                  )}
                </p>

              </div>

              <div className="col-md-6">

                <strong>
                  Updated At
                </strong>

                <p className="mb-0 mt-1">
                  {formatDateTime(
                    interview.updatedAt
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default InterviewDetails;