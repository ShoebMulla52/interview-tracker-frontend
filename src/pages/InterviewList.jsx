import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import interviewService from '../services/interviewService';
import api from '../services/api';

function InterviewList() {

  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [searchType, setSearchType] = useState('candidate');

  const [searchText, setSearchText] = useState('');

  const [status, setStatus] = useState('');

  const [mode, setMode] = useState('');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  // Candidate interview history popup
  const [showCandidatePopup, setShowCandidatePopup] = useState(false);
  const [candidateHistory, setCandidateHistory] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [candidateHistoryLoading, setCandidateHistoryLoading] = useState(false);
  const [candidateHistoryError, setCandidateHistoryError] = useState('');

  const pageSize = 10;

  const loadInterviews = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await interviewService.getAllInterviews(
          page,
          pageSize
        );

      setInterviews(response.data?.content || []);

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {

      console.error(
        'GET INTERVIEWS ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Unable to load interviews'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, [page]);

  const handleSearch = async () => {

    try {

      setLoading(true);
      setError('');
      setPage(0);

      let response;

      if (!searchText.trim()) {
        response =
          await interviewService.getAllInterviews(
            0,
            pageSize
          );
      } else if (searchType === 'candidate') {
        response =
          await interviewService.searchByCandidate(
            searchText,
            0,
            pageSize
          );
      } else {
        response =
          await interviewService.searchByCompany(
            searchText,
            0,
            pageSize
          );
      }

      setInterviews(response.data?.content || []);

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {

      console.error(
        'SEARCH ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Search failed'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleStatusFilter = async (
    selectedStatus
  ) => {

    setStatus(selectedStatus);
    setPage(0);

    if (!selectedStatus) {
      loadInterviews();
      return;
    }

    try {

      setLoading(true);
      setError('');

      const response =
        await interviewService.filterByStatus(
          selectedStatus,
          0,
          pageSize
        );

      setInterviews(
        response.data?.content || []
      );

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Status filter failed'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleModeFilter = async (
    selectedMode
  ) => {

    setMode(selectedMode);
    setPage(0);

    if (!selectedMode) {
      loadInterviews();
      return;
    }

    try {

      setLoading(true);
      setError('');

      const response =
        await interviewService.filterByMode(
          selectedMode,
          0,
          pageSize
        );

      setInterviews(
        response.data?.content || []
      );

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Mode filter failed'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleDateFilter = async () => {

    if (!startDate || !endDate) {

      setError(
        'Please select both start date and end date'
      );

      return;
    }

    try {

      setLoading(true);
      setError('');
      setPage(0);

      const response =
        await interviewService.filterByDate(
          startDate,
          endDate,
          0,
          pageSize
        );

      setInterviews(
        response.data?.content || []
      );

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Date filter failed'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleCandidateClick = async (candidateName, companyName) => {
    try {
      setSelectedCandidate(candidateName);
      setSelectedCompany(companyName);
      setCandidateHistory([]);
      setCandidateHistoryError('');
      setShowCandidatePopup(true);
      setCandidateHistoryLoading(true);

      const response = await api.get(
        `/interviews/candidate/${encodeURIComponent(candidateName)}/company/${encodeURIComponent(companyName)}`
      );

      setCandidateHistory(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error('CANDIDATE HISTORY ERROR:', error);

      setCandidateHistoryError(
        error.response?.data?.message ||
        'Unable to load candidate interview history'
      );
    } finally {
      setCandidateHistoryLoading(false);
    }
  };

  const closeCandidatePopup = () => {
    setShowCandidatePopup(false);
    setCandidateHistory([]);
    setSelectedCandidate('');
    setSelectedCompany('');
    setCandidateHistoryError('');
  };

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this interview?'
      );

    if (!confirmed) {
      return;
    }

    try {

      await interviewService.deleteInterview(id);

      alert('Interview deleted successfully');

      loadInterviews();

    } catch (error) {

      console.error(
        'DELETE ERROR:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Unable to delete interview'
      );
    }
  };

  const handleReset = () => {

    setSearchText('');
    setSearchType('candidate');
    setStatus('');
    setMode('');
    setStartDate('');
    setEndDate('');
    setPage(0);

    loadInterviews();
  };

  const getStatusBadge = (status) => {

    switch (status) {

      case 'SCHEDULED':
        return (
          <span className="badge bg-primary">
            Scheduled
          </span>
        );

      case 'COMPLETED':
        return (
          <span className="badge bg-secondary">
            Completed
          </span>
        );

      case 'SELECTED':
        return (
          <span className="badge bg-success">
            Selected
          </span>
        );

      case 'REJECTED':
        return (
          <span className="badge bg-danger">
            Rejected
          </span>
        );

      case 'ON_HOLD':
        return (
          <span className="badge bg-warning text-dark">
            On Hold
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {status || 'N/A'}
          </span>
        );
    }
  };

  const formatMode = (modeValue) => {

    if (!modeValue) {
      return 'N/A';
    }

    if (modeValue === 'FACE_TO_FACE') {
      return 'Face to Face';
    }

    if (modeValue === 'VIRTUAL') {
      return 'Virtual';
    }

    return modeValue;
  };

  const formatDate = (date) => {

    if (!date) {
      return 'N/A';
    }

    return new Date(date).toLocaleDateString(
      'en-IN'
    );
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 px-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="fw-bold">
              Interviews
            </h2>

            <p className="text-muted">
              Manage and track all interviews
            </p>

          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate('/interviews/add')
            }
          >
            + Add Interview
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Search and Filters */}

        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <div className="row g-3">

              {/* Search Type */}

              <div className="col-md-2">

                <label className="form-label">
                  Search By
                </label>

                <select
                  className="form-select"
                  value={searchType}
                  onChange={(e) =>
                    setSearchType(e.target.value)
                  }
                >
                  <option value="candidate">
                    Candidate
                  </option>

                  <option value="company">
                    Company
                  </option>

                </select>

              </div>

              {/* Search */}

              <div className="col-md-4">

                <label className="form-label">
                  Search
                </label>

                <div className="input-group">

                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      searchType === 'candidate'
                        ? 'Candidate name'
                        : 'Company name'
                    }
                    value={searchText}
                    onChange={(e) =>
                      setSearchText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>

                </div>

              </div>

              {/* Status */}

              <div className="col-md-2">

                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) =>
                    handleStatusFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Status
                  </option>

                  <option value="SCHEDULED">
                    Scheduled
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="SELECTED">
                    Selected
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>

                  <option value="ON_HOLD">
                    On Hold
                  </option>

                </select>

              </div>

              {/* Mode */}

              <div className="col-md-2">

                <label className="form-label">
                  Mode
                </label>

                <select
                  className="form-select"
                  value={mode}
                  onChange={(e) =>
                    handleModeFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Modes
                  </option>

                  <option value="VIRTUAL">
                    Virtual
                  </option>

                  <option value="FACE_TO_FACE">
                    Face to Face
                  </option>

                </select>

              </div>

              {/* Reset */}

              <div className="col-md-2 d-flex align-items-end">

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={handleReset}
                >
                  Reset
                </button>

              </div>

            </div>

            {/* Date Filter */}

            <div className="row g-3 mt-2">

              <div className="col-md-3">

                <label className="form-label">
                  Start Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />

              </div>

              <div className="col-md-3">

                <label className="form-label">
                  End Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />

              </div>

              <div className="col-md-2 d-flex align-items-end">

                <button
                  type="button"
                  className="btn btn-outline-primary w-100"
                  onClick={handleDateFilter}
                >
                  Filter Date
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Interview Table */}

        <div className="card shadow-sm">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="fw-bold mb-0">
                Interview Records
              </h5>

              <span className="text-muted">
                Total: {totalElements}
              </span>

            </div>

            {loading ? (

              <div className="text-center py-5">

                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>

                <p className="mt-2">
                  Loading interviews...
                </p>

              </div>

            ) : interviews.length === 0 ? (

              <div className="text-center py-5">

                <h5>
                  No interviews found
                </h5>

                <p className="text-muted">
                  Try changing your search or filters.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-dark">

                    <tr>

                      <th>ID</th>

                      <th>Candidate</th>

                      <th>Company</th>

                      <th>Supporter</th>

                      <th>Date</th>

                      <th>Time</th>

                      <th>Round</th>

                      <th>Role</th>

                      <th>Mode</th>

                      <th>Status</th>

                      <th>Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {interviews.map((interview) => (

                      <tr key={interview.id}>

                        <td>
                          {interview.id}
                        </td>

                        <td
                          className="fw-semibold"
                          style={{
                            cursor: 'pointer',
                            color: '#0d6efd',
                          }}
                          onClick={() =>
                            handleCandidateClick(
                              interview.candidateName,
                              interview.companyName
                            )
                          }
                          title="View interview rounds"
                        >
                          {interview.candidateName}
                        </td>

                        <td>
                          {interview.companyName}
                        </td>

                        <td>
                          {interview.interviewSupporter ||
                            'N/A'}
                        </td>

                        <td>
                          {formatDate(
                            interview.interviewDate
                          )}
                        </td>

                        <td>
                          {interview.interviewTime ||
                            'N/A'}
                        </td>

                        <td>
                          {interview.round ||
                            'N/A'}
                        </td>

                        <td>
                          {interview.role ||
                            'N/A'}
                        </td>

                        <td>
                          {formatMode(
                            interview.mode
                          )}
                        </td>

                        <td>
                          {getStatusBadge(
                            interview.status
                          )}
                        </td>

                        <td>

                          <div className="d-flex gap-1">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(
                                  `/interviews/${interview.id}`
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
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
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  interview.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

            {/* Pagination */}

            {!loading && totalPages > 1 && (

              <div className="d-flex justify-content-center mt-4">

                <nav>

                  <ul className="pagination">

                    <li
                      className={`page-item ${
                        page === 0
                          ? 'disabled'
                          : ''
                      }`}
                    >

                      <button
                        type="button"
                        className="page-link"
                        onClick={() =>
                          setPage(
                            Math.max(
                              page - 1,
                              0
                            )
                          )
                        }
                      >
                        Previous
                      </button>

                    </li>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => (

                        <li
                          key={index}
                          className={`page-item ${
                            page === index
                              ? 'active'
                              : ''
                          }`}
                        >

                          <button
                            type="button"
                            className="page-link"
                            onClick={() =>
                              setPage(index)
                            }
                          >
                            {index + 1}
                          </button>

                        </li>

                      )
                    )}

                    <li
                      className={`page-item ${
                        page === totalPages - 1
                          ? 'disabled'
                          : ''
                      }`}
                    >

                      <button
                        type="button"
                        className="page-link"
                        onClick={() =>
                          setPage(
                            Math.min(
                              page + 1,
                              totalPages - 1
                            )
                          )
                        }
                      >
                        Next
                      </button>

                    </li>

                  </ul>

                </nav>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* Candidate Interview History Popup */}
      {showCandidatePopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '20px',
          }}
          onClick={closeCandidatePopup}
        >
          <div
            className="card shadow"
            style={{
              width: '100%',
              maxWidth: '950px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold">
                  Interview History
                </h5>
                <div className="text-muted small">
                  {selectedCandidate} — {selectedCompany}
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeCandidatePopup}
              ></button>
            </div>

            <div className="card-body">
              {candidateHistoryLoading ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Loading...
                    </span>
                  </div>
                  <p className="mt-2 mb-0">
                    Loading interview rounds...
                  </p>
                </div>
              ) : candidateHistoryError ? (
                <div className="alert alert-danger mb-0">
                  {candidateHistoryError}
                </div>
              ) : candidateHistory.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No interview rounds found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Round</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Role</th>
                        <th>Mode</th>
                        <th>Status</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>

                    <tbody>
                      {candidateHistory.map((interview) => (
                        <tr key={interview.id}>
                          <td>{interview.round || 'N/A'}</td>
                          <td>{formatDate(interview.interviewDate)}</td>
                          <td>{interview.interviewTime || 'N/A'}</td>
                          <td>{interview.role || 'N/A'}</td>
                          <td>{formatMode(interview.mode)}</td>
                          <td>{getStatusBadge(interview.status)}</td>
                          <td>{interview.feedback || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card-footer text-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeCandidatePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default InterviewList;