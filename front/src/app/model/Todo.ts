export type TodoStatus = 'published' | 'draft' | 'archived';
export interface Todo {
  id: number;
  category: string;
  content: string;
  image: string;
  publishedAt: string; // format "dd/MM/yyyy HH:mm:ss"
  slug: string;
  status: TodoStatus;
  thumbnail: string;
  title: string;
  updatedAt: string;   // format "dd/MM/yyyy HH:mm:ss"
  url: string;
  userId: number;
}