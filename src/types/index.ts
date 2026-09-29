export interface Facility {
  id: number;
  name: string;
  type: string;
  category: string;
  status: '정상운영' | '폐업';
  lat: number;
  lng: number;
  sido: string;
  sigungu: string;
  roadAddr: string;
  floor?: number;
  areaM2?: number;
  isPublic: boolean;
  isFree?: boolean;
  openWeekday?: string;
  openWeekend?: string;
  capacity?: number;
}

export interface Analysis {
  id: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  radiusM: number;
  createdAt: string;
}

export interface Report {
  id: string;
  analysisId: string;
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  competitorCount: number;
  closureRate: number;
  publicRatio: number;
  isPaid: boolean;
  pdfUrl?: string;
  summaryJson?: Record<string, unknown>;
  dataSnapshotAt: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bundleType: 1 | 3 | 5;
  totalCredits: number;
  amount: number;
  pgProvider: string;
  status: 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export interface Credit {
  id: string;
  paymentId: string;
  reportId?: string;
  usedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  provider: 'kakao' | 'naver' | 'google';
}
