import { Lesson } from './lesson';
import { Topic } from './topic';

export interface CourseInstructor {
  id: string;
  name: string;
  email?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  instructor: CourseInstructor;
  topic: Topic;
  lessons?: Lesson[];
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  topicId: string;
  price: number;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  topicId?: string;
  price?: number;
}
