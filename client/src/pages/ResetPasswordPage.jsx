import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validToken, setValidToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      return;
    }
    axios.get('/reset-password/verify', { params: { token } })
      .then(() => setValidToken(true))
      .catch(() => setValidToken(false));
  }, [token]);

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/reset-password', { token, password });
      alert(res.data.message);
      navigate('/login');
    } catch (e) {
      const message = e.response?.data?.message || 'Unable to reset password';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  if (validToken === null) {
    return <div className="mt-8 text-center text-gray-500">Verifying reset link...</div>;
  }

  if (!validToken) {
    return (
      <div className="mt-8 text-center max-w-md mx-auto">
        <p className="text-red-600 mb-4">This reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="text-primary underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 max-w-md w-full">
        <h1 className="text-4xl text-center mb-4">Set new password</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={ev => setConfirmPassword(ev.target.value)}
            required
            minLength={6}
          />
          <button className="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
        <div className="text-center py-4 text-gray-500">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
