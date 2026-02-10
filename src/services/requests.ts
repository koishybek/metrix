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
import { fileToBase64 } from '../lib/utils';

export interface ServiceRequest {
  id: string;
  userId: string;
  userPhone: string;
  type: 'verification' | 'repair' | 'consultation' | 'seal' | 'account_attach' | 'reading_submit' | 'other';
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  details: string;
  createdAt: any;
  meterSerial?: string;
  photoUrl?: string;
  reading?: number;
}

export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  try {
    // Convert file to Base64 string directly
    // bypassing Firebase Storage to avoid payment/plan issues
    const base64 = await fileToBase64(file);
    return base64;
  } catch (error) {
    console.error("Error converting photo:", error);
    throw error;
  }
};

export const createServiceRequest = async (
  userId: string, 
  userPhone: string,
  type: ServiceRequest['type'], 
  details: string,
  meterSerial?: string,
  photoUrl?: string,
  reading?: number
) => {
  try {
    await addDoc(collection(db, 'service_requests'), {
      userId,
      userPhone,
      type,
      status: 'new',
      details,
      meterSerial: meterSerial || null,
      photoUrl: photoUrl || null,
      reading: reading || null,
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
