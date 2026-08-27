import React, { useEffect, useState } from 'react';
import { getStudentDashboard } from '../../api/dashboard';
import { StudentDashboardItem } from '../../types/dashboard';
import StudentDashboard from '../../components/organisms/StudentDashboard/StudentDashboard';

const StudentDashboardPage: React.FC = () => {
  const [items, setItems] = useState<StudentDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentDashboard()
      .then(setItems)
      .catch(() => setError('Failed to load dashboard. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track your learning progress</p>
      </div>
      <StudentDashboard items={items} loading={loading} error={error} />
    </div>
  );
};

export default StudentDashboardPage;
