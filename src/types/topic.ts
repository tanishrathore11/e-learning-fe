export interface Topic {
  id: string;
  name: string;
  description?: string | null;
}

export interface CreateTopicPayload {
  name: string;
  description?: string;
}
