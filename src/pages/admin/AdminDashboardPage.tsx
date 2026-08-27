import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAdminDashboard } from '../../api/dashboard';
import { AdminDashboardData } from '../../types/dashboard';
import Spinner from '../../components/atoms/Spinner/Spinner';
import Badge from '../../components/atoms/Badge/Badge';
import { Users, GraduationCap, School, Mail, BookOpen, UserCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessPopup(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.errorMessage) {
      setErrorPopup(location.state.errorMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setError('Failed to load admin dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl inline-block">
          {error || 'Failed to load dashboard data.'}
        </div>
      </div>
    );
  }

  const { students, instructors } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
      {/* Popups */}
      {successPopup && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{successPopup}</p>
          </div>
          <button onClick={() => setSuccessPopup(null)} className="text-emerald-500 hover:text-emerald-700 p-1 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorPopup && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm font-semibold">{errorPopup}</p>
          </div>
          <button onClick={() => setErrorPopup(null)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Premium Background Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" /> Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">Manage and overview all students and instructors registered in the platform.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Students Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Registered Students</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-0.5">{students.length}</h3>
          </div>
        </div>

        {/* Total Instructors Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <School className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Registered Instructors</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-0.5">{instructors.length}</h3>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-12">
        {/* Instructors Directory */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-600" /> Instructors List ({instructors.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {instructors.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No instructors registered yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Biography</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Created Courses</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Enrolled Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {instructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">{inst.name}</div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {inst.email}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 max-w-sm">
                        <p className="line-clamp-2" title={inst.bio ?? ''}>
                          {inst.bio ? inst.bio : <span className="text-gray-400 italic">No biography provided.</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <Badge variant="indigo" className="inline-flex items-center gap-1 font-bold">
                          <BookOpen className="w-3 h-3" /> {inst.courseCount}
                        </Badge>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <Badge variant="green" className="inline-flex items-center gap-1 font-bold">
                          <UserCheck className="w-3 h-3" /> {inst.studentCount}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Students Directory */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" /> Students List ({students.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No students registered yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Biography</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Enrolled Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((stud) => (
                    <tr key={stud.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">{stud.name}</div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {stud.email}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 max-w-sm">
                        <p className="line-clamp-2" title={stud.bio ?? ''}>
                          {stud.bio ? stud.bio : <span className="text-gray-400 italic">No biography provided.</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <Badge variant="green" className="inline-flex items-center gap-1 font-bold">
                          <BookOpen className="w-3 h-3" /> {stud.courseCount}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
