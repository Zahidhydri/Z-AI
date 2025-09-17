export enum MediaType {
  Image = 'image',
  Video = 'video',
}

export type ActiveView = 'chat' | 'media';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}