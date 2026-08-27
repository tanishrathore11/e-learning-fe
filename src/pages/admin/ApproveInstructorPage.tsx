import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { approveInstructor } from '../../api/auth';
import Spinner from '../../components/atoms/Spinner/Spinner';
import Button from '../../components/atoms/Button/Button';
import { ShieldAlert, AlertCircle } from 'lucide-react';

const ApproveInstructorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No approval token was found in the URL. Please verify your link.');
      return;
    }

    if (!user) {
      // Save token and redirect to login
      localStorage.setItem('pending_instructor_approval_token', token);
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'ADMIN') {
      setStatus('idle'); // We will show the switch account screen below
      return;
    }

    // Admin is logged in, submit token
    const performApproval = async () => {
      setStatus('processing');
      try {
        await approveInstructor(token);
        localStorage.removeItem('pending_instructor_approval_token');
        
        // Redirect to admin dashboard and pass state for success message
        navigate('/admin/dashboard', {
          state: { successMessage: 'Instructor has been approved successfully.' },
          replace: true
        });
      } catch (err: any) {
        setStatus('error');
        const msg = err.response?.data?.message ?? 'Failed to approve instructor. The token may be expired or invalid.';
        setErrorMessage(msg);
      }
    };

    performApproval();
  }, [token, user, navigate]);

  const handleSwitchAccount = () => {
    if (token) {
      localStorage.setItem('pending_instructor_approval_token', token);
    }
    logout();
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Request</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
          <Button onClick={() => navigate('/')} className="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Administrator Access Required</h2>
          <p className="text-sm text-gray-500 mb-4">
            You are logged in as <span className="font-semibold text-gray-700">{user.email}</span> ({user.role}). Only administrators can approve instructors.
          </p>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-6">
            Please log out and sign in using an administrator account.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleSwitchAccount} className="w-full">
              Login as Administrator
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <Spinner size="lg" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Approval</h2>
          <p className="text-sm text-gray-500">Verifying security token and setting up the instructor profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Approval Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <Spinner size="md" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Initializing...</h2>
      </div>
    </div>
  );
};

export default ApproveInstructorPage;
