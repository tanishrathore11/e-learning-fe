import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import { useAuth } from '../../../hooks/useAuth';
import { approveInstructor } from '../../../api/auth';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard');
      } else if (user.role === 'ADMIN') {
        const pendingToken = localStorage.getItem('pending_instructor_approval_token');
        if (pendingToken) {
          try {
            await approveInstructor(pendingToken);
            localStorage.removeItem('pending_instructor_approval_token');
            navigate('/admin/dashboard', {
              state: { successMessage: 'Instructor has been approved successfully.' },
              replace: true
            });
            return;
          } catch (err: any) {
            localStorage.removeItem('pending_instructor_approval_token');
            const msg = err.response?.data?.message ?? 'Failed to approve instructor. The token may be expired or invalid.';
            navigate('/admin/dashboard', {
              state: { errorMessage: msg },
              replace: true
            });
            return;
          }
        }
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button type="submit" isLoading={loading} className="w-full mt-1">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 hover:underline font-medium">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
