import React from 'react';
import { InstructorDashboardData } from '../../../types/dashboard';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';
import Spinner from '../../atoms/Spinner/Spinner';

interface InstructorDashboardProps {
  data: InstructorDashboardData | null;
  loading?: boolean;
  error?: string;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ data, loading, error }) => {
  if (loading) {
    return <div className="py-16"><Spinner size="lg" className="justify-center" /></div>;
  }
  if (error) {
    return <p className="text-red-600 text-sm py-4">{error}</p>;
  }
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-indigo-600">{data.totalCourses}</p>
          <p className="text-sm text-gray-500 mt-1">Total Courses</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-indigo-600">{data.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-1">Total Students</p>
        </div>
      </div>

      {/* Per-course student progress */}
      {data.courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm">
          No courses yet. Create your first course!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.courses.map((course, ci) => (
            <div key={ci} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">{course.courseName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {course.students.length} student{course.students.length !== 1 ? 's' : ''}
                </p>
              </div>
              {course.students.length === 0 ? (
                <p className="px-5 py-4 text-sm text-gray-500">No students enrolled yet.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-5 py-2 text-left text-xs font-medium text-gray-500 w-40">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.students.map((student, si) => (
                      <tr key={si} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-sm text-gray-800">{student.name}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProgressBar value={student.completionPercentage} className="flex-1" />
                            <span className="text-xs text-gray-600 w-8 text-right">
                              {student.completionPercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
