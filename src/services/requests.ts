import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  updateDoc,
  doc
} from 'firebase/firestore';

export interface ServiceRequest {
  id: string;
  userId: string;
  userPhone: string;
  type: 'verification' | 'repair' | 'consultation' | 'seal' | 'other';
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  details: string;
  createdAt: any;
  meterSerial?: string;
}

export const createServiceRequest = async (
  userId: string, 
  userPhone: string,
  type: ServiceRequest['type'], 
  details: string,
  meterSerial?: string
) => {
  try {
    await addDoc(collection(db, 'service_requests'), {
      userId,
      userPhone,
      type,
      status: 'new',
      details,
      meterSerial: meterSerial || null,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

export const getUserRequests = async (userId: string): Promise<ServiceRequest[]> => {
  try {
    const q = query(
      collection(db, 'service_requests'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ServiceRequest));
  } catch (error) {
    console.error("Error getting user requests:", error);
    throw error;
  }
};

export const getAllRequests = async (): Promise<ServiceRequest[]> => {
  try {
    // Note: ordering by createdAt desc requires an index in Firestore if combined with where clauses,
    // but for getAll we usually just want all.
    const q = query(
      collection(db, 'service_requests'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ServiceRequest));
  } catch (error) {
    console.error("Error getting all requests:", error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId: string, status: ServiceRequest['status']) => {
  try {
    const ref = doc(db, 'service_requests', requestId);
    await updateDoc(ref, { status });
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};
