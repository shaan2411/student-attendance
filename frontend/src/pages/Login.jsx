import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      navigate(loggedUser.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@school.com', password: 'admin123' });
    else setForm({ email: 'alice@school.com', password: 'student123' });
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1 className="login-title">EduTrack</h1>
          <p className="login-subtitle">Attendance Management System</p>
        </div>

        {/* Demo Buttons */}
        <div className="demo-btns">
          <button className="demo-btn" onClick={() => fillDemo('admin')} type="button">
            <span>👤</span> Admin Demo
          </button>
          <button className="demo-btn" onClick={() => fillDemo('student')} type="button">
            <span>🎓</span> Student Demo
          </button>
        </div>

        <div className="login-divider">
          <span>or sign in manually</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@school.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <p className="login-footer">
          Secured with JWT authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
