import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/forgot-password', { email });
      alert(res.data.message);
      setSubmitted(true);
    } catch (e) {
      const message = e.response?.data?.message || 'Something went wrong. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 max-w-md w-full">
        <h1 className="text-4xl text-center mb-4">Forgot password</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and we will send you a link to reset your password.
        </p>

        {!submitted ? (
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              required
            />
            <button className="primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">
            Check your inbox for the reset link.
          </p>
        )}

        <div className="text-center py-4 text-gray-500">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
