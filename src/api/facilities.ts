import client from './client';
import type { Facility } from '../types';

export const getNearbyFacilities = (params: {
  lat: number;
  lng: number;
  radius?: number;
  category?: string;
}) => client.get<Facility[]>('/api/v1/facilities/nearby', { params }).then(r => r.data);

export const getFacilityDetail = (id: number) =>
  client.get<Facility>(`/api/v1/facilities/${id}`).then(r => r.data);
