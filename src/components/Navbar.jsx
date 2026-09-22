import { useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('username');

    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">

      <div className="container-fluid">

        <div className="d-flex align-items-center">

          <span
            className="navbar-brand mb-0"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            NS World Interview Tracker
          </span>

        </div>

        <div className="d-flex align-items-center">

          <button
            type="button"
            className="btn btn-dark me-2"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="btn btn-dark me-2"
            onClick={() => navigate('/interviews')}
          >
            Interviews
          </button>

          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </button>

          <span className="text-white me-3">
            {username}
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;