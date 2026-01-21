/**
 * Topic Note Types
 * Konu notları için type tanımlamaları
 */

export interface TopicNote {
  id: string;
  topicId: string; // SubjectTopic.id
  subject: string; // Subject
  content: string;
  createdAt: string;
  updatedAt: string;
}
