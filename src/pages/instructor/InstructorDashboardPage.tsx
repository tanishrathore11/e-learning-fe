import React, { useEffect, useState } from 'react';
import { getInstructorDashboard } from '../../api/dashboard';
import { InstructorDashboardData } from '../../types/dashboard';
import InstructorDashboard from '../../components/organisms/InstructorDashboard/InstructorDashboard';

const InstructorDashboardPage: React.FC = () => {
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getInstructorDashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your courses and students</p>
      </div>
      <InstructorDashboard data={data} loading={loading} error={error} />
    </div>
  );
};

export default InstructorDashboardPage;
