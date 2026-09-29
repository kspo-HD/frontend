import client from './client';

export interface Me {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string;
  provider: string;
  role: string;
  remainingCredits: number;
  createdAt: string;
}

export const getMe = () =>
  client.get<Me>('/api/v1/users/me').then(r => r.data);
