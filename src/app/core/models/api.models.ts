export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  role: string;
  token: string;
  centreId?: number;
  centreName?: string;
}

export interface UserProfile {
  username: string;
  role: string;
  centreId?: number;
  centreName?: string;
  referenceCode?: string;
}

export interface ProcurementCentre {
  id: number;
  centreCode: string;
  centreName: string;
  district: string;
  state: string;
  address: string;
  pincode?: string;
  dailyCapacity?: number;
  dailyCapacityQuintals?: number;
  currentStatus: 'OPEN' | 'OPERATIONAL' | 'FULL' | 'CLOSED' | 'MAINTENANCE' | 'SUSPENDED';
  operatingStart?: string;
  operatingEnd?: string;
  contactPersonName?: string;
  contactMobile?: string;
}

export interface ProcurementQueue {
  id: number;
  centreId: number;
  tokenId: number;
  tokenNumber: string;
  tokenDate: string;
  tokenSlotTime: string;
  farmerName: string;
  farmerRegistrationNo: string;
  cropName: string;
  estimatedQuantityQuintals: number;
  queueStatus: 'SCHEDULED' | 'WAITING' | 'CHECKED_IN' | 'CALLED' | 'IN_PROCESS' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
  checkInTime?: string;
  calledTime?: string;
  processingStartTime?: string;
  completedTime?: string;
  remarks?: string;
}

export interface ProcurementSlot {
  id: number;
  centreId: number;
  farmerId: number;
  farmerName?: string;
  slotDate: string;
  slotTime: string;
  cropName: string;
  estimatedQuantityQuintals: number;
  slotStatus: 'BOOKED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
}

export interface ProcurementRecord {
  id: number;
  centreId: number;
  farmerId: number;
  farmerName?: string;
  cropName?: string;
  quantityQuintals?: number;
  declaredQuantityQuintals?: number;
  actualQuantityQuintals?: number;
  ratePerQuintal?: number;
  mspRatePerQuintal?: number;
  totalAmount?: number;
  qualityGrade?: string;
  moisturePercentage?: number;
  status?: 'PENDING' | 'IN_PROCESS' | 'VERIFIED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  procurementStatus?: 'PENDING' | 'IN_PROCESS' | 'VERIFIED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  procurementDate?: string;
}

export interface Payment {
  id: number;
  procurementId: number;
  farmerId: number;
  farmerName: string;
  amount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  paymentDate?: string;
  transactionRef?: string;
}

export interface Farmer {
  id: number;
  farmerRegistrationNo: string;
  fullName: string;
  mobileNumber: string;
  state: string;
  district: string;
  village: string;
  landAreaAcres: number;
  centreId?: number;
  accountStatus: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}
