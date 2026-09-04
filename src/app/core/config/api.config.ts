export const BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  ME: `${BASE_URL}/auth/me`,

  // Procurement Centres
  CENTRES: `${BASE_URL}/procurement-centres`,
  CENTRE_BY_ID: (id: number | string) => `${BASE_URL}/procurement-centres/${id}`,
  CENTRE_STATUS: (id: number | string) => `${BASE_URL}/procurement-centres/${id}/status`,
  CENTRE_CAPACITY: (id: number | string) => `${BASE_URL}/procurement-centres/${id}/capacity`,

  // Queue Management
  QUEUE: `${BASE_URL}/procurement-queue`,
  CENTRE_QUEUE: (centreId: number | string, date: string) => `${BASE_URL}/procurement-queue/centre/${centreId}/date/${date}`,
  WAITING_QUEUE: (centreId: number | string, date: string) => `${BASE_URL}/procurement-queue/centre/${centreId}/date/${date}/waiting`,
  ADD_TOKEN_TO_QUEUE: (tokenId: number | string) => `${BASE_URL}/procurement-queue/token/${tokenId}`,
  QUEUE_CHECK_IN: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/check-in`,
  QUEUE_CALL: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/call`,
  QUEUE_PROCESS: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/process`,
  QUEUE_COMPLETE: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/complete`,
  QUEUE_SKIP: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/skip`,
  QUEUE_CANCEL: (id: number | string) => `${BASE_URL}/procurement-queue/${id}/cancel`,

  // Slots
  SLOTS: `${BASE_URL}/procurement-slots`,
  CENTRE_SLOTS: (centreId: number | string, date: string) => `${BASE_URL}/procurement-slots/centre/${centreId}/date/${date}`,
  SLOT_STATUS: (id: number | string) => `${BASE_URL}/procurement-slots/${id}/status`,

  // Procurement Records
  PROCUREMENT: `${BASE_URL}/procurement`,
  PROCUREMENT_BY_ID: (id: number | string) => `${BASE_URL}/procurement/${id}`,
  PROCESS_PROCUREMENT: (id: number | string) => `${BASE_URL}/procurement/${id}/process`,
  COMPLETE_PROCUREMENT: (id: number | string) => `${BASE_URL}/procurement/${id}/complete`,

  // Centre Operations (Crops, Gates, Counters)
  ACCEPTED_CROPS: (centreId: number | string) => `${BASE_URL}/centre-operations/centre/${centreId}/crops`,
  CENTRE_GATES: (centreId: number | string) => `${BASE_URL}/centre-operations/centre/${centreId}/gates`,
  ASSIGN_CROP_TO_GATE: (centreId: number | string, gateId: number | string, cropId: number | string) => `${BASE_URL}/centre-operations/centre/${centreId}/gates/${gateId}/assign-crop?cropId=${cropId}`,
  UPDATE_GATE_STATUS: (centreId: number | string, gateId: number | string, status: string) => `${BASE_URL}/centre-operations/centre/${centreId}/gates/${gateId}/status?status=${status}`,
  CENTRE_COUNTERS: (centreId: number | string) => `${BASE_URL}/centre-operations/centre/${centreId}/counters`,
  ASSIGN_GATE_TO_COUNTER: (centreId: number | string, counterId: number | string, gateId: number | string) => `${BASE_URL}/centre-operations/centre/${centreId}/counters/${counterId}/assign-gate?gateId=${gateId}`,
  UPDATE_COUNTER_STATUS: (centreId: number | string, counterId: number | string, status: string) => `${BASE_URL}/centre-operations/centre/${centreId}/counters/${counterId}/status?status=${status}`,

  // Farmers
  FARMERS: `${BASE_URL}/farmer`,
  FARMER_BY_ID: (id: number | string) => `${BASE_URL}/farmer/${id}`,

  // Payments
  PAYMENTS: `${BASE_URL}/payment`,
  PAYMENT_BY_ID: (id: number | string) => `${BASE_URL}/payment/${id}`,

  // Notifications
  NOTIFICATIONS: `${BASE_URL}/notifications`,
};
