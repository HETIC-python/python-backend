export type ServiceType = 'test_drive' | 'financial_advice' | 'maintenance' | 'inspection';

export interface Appointment {
  id: number;
  userId: number;
  carId: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  serviceType: ServiceType;
  notes?: string;
  car: {
    brand: string;
    model: string;
    imageUrl: string;
  };
}
