import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import { useAuth } from '../../../hooks/useAuth';
import { Role } from '../../../types/auth';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({ name, email, password, role });
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'INSTRUCTOR') navigate('/instructor/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-name" className="text-sm font-medium text-gray-700">Full Name</label>
        <Input
          id="reg-name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-email" className="text-sm font-medium text-gray-700">Email</label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-password" className="text-sm font-medium text-gray-700">Password</label>
        <Input
          id="reg-password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-role" className="text-sm font-medium text-gray-700">Role</label>
        <select
          id="reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button type="submit" isLoading={loading} className="w-full mt-1">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
