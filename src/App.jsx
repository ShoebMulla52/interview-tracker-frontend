import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewList from './pages/InterviewList';
import AddInterview from './pages/AddInterview';
import InterviewDetails from './pages/InterviewDetails';
import EditInterview from './pages/EditInterview';

import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Routes>

      {/* Default */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Login */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Dashboard */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Interview List */}

      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <InterviewList />
          </ProtectedRoute>
        }
      />

      {/* Add Interview */}

      <Route
        path="/interviews/add"
        element={
          <ProtectedRoute>
            <AddInterview />
          </ProtectedRoute>
        }
      />

      {/* Edit Interview */}

      <Route
        path="/interviews/edit/:id"
        element={
          <ProtectedRoute>
            <EditInterview />
          </ProtectedRoute>
        }
      />

      {/* Interview Details */}

      <Route
        path="/interviews/:id"
        element={
          <ProtectedRoute>
            <InterviewDetails />
          </ProtectedRoute>
        }
      />

      {/* Unknown Route */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;