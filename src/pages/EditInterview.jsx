import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import interviewService from '../services/interviewService';

function EditInterview() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    candidateName: '',
    companyName: '',
    interviewSupporter: '',
    interviewDate: '',
    interviewTime: '',
    round: '',
    role: '',
    mode: 'VIRTUAL',
    status: 'SCHEDULED',
    feedback: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await interviewService.getInterviewById(id);

      const data = response.data;

      setFormData({
        candidateName:
          data.candidateName || '',

        companyName:
          data.companyName || '',

        interviewSupporter:
          data.interviewSupporter || '',

        interviewDate:
          data.interviewDate || '',

        interviewTime:
          data.interviewTime
            ? data.interviewTime.substring(0, 5)
            : '',

        round:
          data.round || '',

        role:
          data.role || '',

        mode:
          data.mode || 'VIRTUAL',

        status:
          data.status || 'SCHEDULED',

        feedback:
          data.feedback || '',

        remarks:
          data.remarks || '',
      });

    } catch (error) {

      console.error(
        'GET INTERVIEW ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Unable to load interview'
      );

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');
    setSaving(true);

    try {

      const response =
        await interviewService.updateInterview(
          id,
          formData
        );

      console.log(
        'UPDATE INTERVIEW RESPONSE:',
        response
      );

      setSuccess(
        'Interview updated successfully.'
      );

      setTimeout(() => {
        navigate(`/interviews/${id}`);
      }, 1000);

    } catch (error) {

      console.error(
        'UPDATE INTERVIEW ERROR:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Unable to update interview'
      );

    } finally {

      setSaving(false);

    }
  };

  const handleCancel = () => {
    navigate(`/interviews/${id}`);
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
            Loading interview...
          </p>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="fw-bold">
              Edit Interview
            </h2>

            <p className="text-muted">
              Update interview ID: {id}
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Form */}

        <div className="card shadow-sm">

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* Candidate */}

                <div className="col-md-6">

                  <label className="form-label">
                    Candidate Name *
                  </label>

                  <input
                    type="text"
                    name="candidateName"
                    className="form-control"
                    value={formData.candidateName}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Company */}

                <div className="col-md-6">

                  <label className="form-label">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    className="form-control"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Supporter */}

                <div className="col-md-6">

                  <label className="form-label">
                    Interview Supporter
                  </label>

                  <input
                    type="text"
                    name="interviewSupporter"
                    className="form-control"
                    value={
                      formData.interviewSupporter
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* Role */}

                <div className="col-md-6">

                  <label className="form-label">
                    Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  />

                </div>

                {/* Date */}

                <div className="col-md-4">

                  <label className="form-label">
                    Interview Date
                  </label>

                  <input
                    type="date"
                    name="interviewDate"
                    className="form-control"
                    value={formData.interviewDate}
                    onChange={handleChange}
                  />

                </div>

                {/* Time */}

                <div className="col-md-4">

                  <label className="form-label">
                    Interview Time
                  </label>

                  <input
                    type="time"
                    name="interviewTime"
                    className="form-control"
                    value={formData.interviewTime}
                    onChange={handleChange}
                  />

                </div>

                {/* Round */}

                <div className="col-md-4">

                  <label className="form-label">
                    Round
                  </label>

                  <input
                    type="text"
                    name="round"
                    className="form-control"
                    value={formData.round}
                    onChange={handleChange}
                  />

                </div>

                {/* Mode */}

                <div className="col-md-6">

                  <label className="form-label">
                    Interview Mode
                  </label>

                  <select
                    name="mode"
                    className="form-select"
                    value={formData.mode}
                    onChange={handleChange}
                  >

                    <option value="VIRTUAL">
                      Virtual
                    </option>

                    <option value="FACE_TO_FACE">
                      Face to Face
                    </option>

                  </select>

                </div>

                {/* Status */}

                <div className="col-md-6">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >

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

                {/* Feedback */}

                <div className="col-12">

                  <label className="form-label">
                    Feedback
                  </label>

                  <textarea
                    name="feedback"
                    className="form-control"
                    rows="4"
                    value={formData.feedback}
                    onChange={handleChange}
                  />

                </div>

                {/* Remarks */}

                <div className="col-12">

                  <label className="form-label">
                    Remarks
                  </label>

                  <textarea
                    name="remarks"
                    className="form-control"
                    rows="4"
                    value={formData.remarks}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Updating...'
                    : 'Update Interview'}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}

export default EditInterview;