import client from './client';
import type { Analysis, Report, Payment } from '../types';

export const createAnalysis = (body: Omit<Analysis, 'id' | 'createdAt'>) =>
  client.post<Analysis>('/api/v1/analyses', body, { timeout: 60000 }).then(r => r.data);

export const getMyAnalyses = () =>
  client.get<Analysis[]>('/api/v1/analyses').then(r => r.data);

export const getReport = (reportId: string) =>
  client.get<Report>(`/api/v1/reports/${reportId}`).then(r => r.data);

export const getMyReports = () =>
  client.get<Report[]>('/api/v1/reports').then(r => r.data);

// 크레딧으로 리포트 잠금 해제
export const unlockReport = (reportId: string) =>
  client.post<Report>(`/api/v1/reports/${reportId}/unlock`).then(r => r.data);

// 더미 결제 (실 PG 연동 전)
export const purchaseBundle = (bundleType: 1 | 3 | 5) =>
  client.post<Payment>('/api/v1/payments', { bundleType }).then(r => r.data);

export const getRemainingCredits = () =>
  client.get<{ count: number }>('/api/v1/credits/remaining').then(r => r.data);
