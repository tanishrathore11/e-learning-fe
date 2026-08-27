export type LessonType = 'VIDEO' | 'NOTES';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content?: string | null;
  videoUrl?: string | null;
  position?: number | null;
  isCompleted?: boolean;
}

export interface CreateLessonPayload {
  courseId: string;
  title: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  position?: number;
}

export interface UpdateLessonPayload {
  title?: string;
  type?: LessonType;
  content?: string;
  videoUrl?: string;
  position?: number;
}
