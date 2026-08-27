import { Course } from './course';

export interface Enrollment {
  id: string;
  course: Course;
  enrolledAt?: string;
}
