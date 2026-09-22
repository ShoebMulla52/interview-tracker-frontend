import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(
        'New password and confirm password do not match.'
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'New password should be different from current password.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
        '/admin/change-password',
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      setSuccess(
        response.data || 'Password changed successfully.'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Failed to change password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">

            <div className="card shadow-sm">

              <div className="card-header">
                <h5 className="mb-1">
                  Change Password
                </h5>

                <small className="text-muted">
                  Update your admin account password
                </small>
              </div>

              <div className="card-body">

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleChangePassword}>

                  <div className="mb-3">
                    <label className="form-label">
                      Current Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading
                        ? 'Changing...'
                        : 'Change Password'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;