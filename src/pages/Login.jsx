import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/admin/login', {
        username,
        password,
      });

      console.log('LOGIN RESPONSE:', response.data);

      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      navigate('/dashboard');

    } catch (error) {

      console.error('LOGIN ERROR:', error);
      console.error('STATUS:', error.response?.status);
      console.error('DATA:', error.response?.data);

      setError(
        error.response?.data?.message ||
        error.message ||
        'Login failed'
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Interview Tracker
              </h3>

              <h5 className="text-center mb-4">
                Admin Login
              </h5>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>

                <div className="mb-3">
                  <label className="form-label">
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;