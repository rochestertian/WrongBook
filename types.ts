export interface Question {
  id: string;
  title: string;
  imageUrl: string;
  subject: string;
  category: string;
  difficulty: number;
  createdAt: string;
  reviewDate?: string; // ISO 8601 格式
}

export interface AppConfig {
  serverUrl: string;
  version: string;
  buildBy: string;
  contact: string;
}

export enum View {
  HOME = 'HOME',
  CAPTURE = 'CAPTURE',
  SETTINGS = 'SETTINGS',
  ABOUT = 'ABOUT'
}

export const SUBJECTS = ['数学', '语文', '英语', '物理', '化学', '生物', '其他'];