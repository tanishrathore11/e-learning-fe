import { Enrollment } from './enrollment';

export interface StudentDashboardItem {
  enrollment: Enrollment;
  completedLessons: number;
}

export interface InstructorCourseStudent {
  name: string;
  completionPercentage: number;
}

export interface InstructorDashboardCourse {
  courseName: string;
  students: InstructorCourseStudent[];
}

export interface InstructorDashboardData {
  totalCourses: number;
  totalStudents: number;
  courses: InstructorDashboardCourse[];
}

export interface MarkProgressPayload {
  enrollmentId: string;
  lessonId: string;
}

export interface AdminStudentItem {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  courseCount: number;
}

export interface AdminInstructorItem {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  courseCount: number;
  studentCount: number;
}

export interface AdminDashboardData {
  students: AdminStudentItem[];
  instructors: AdminInstructorItem[];
}
