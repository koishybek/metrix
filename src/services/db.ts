import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { MeterData } from '../types';

export interface SavedMeter {
  id: string;
  userId: string;
  serial: string;
  account: string;
  address: string;
  createdAt: any;
  // Cache some data for list view
  lastReading?: number;
  lastUpdate?: string;
  status?: string;
}

export interface UserStat {
  id: string;
  phone: string;
  createdAt: any;
  lastLogin: any;
  meterCount: number;
  meters?: SavedMeter[];
}

// === Meter Operations ===

export const addMeterToUser = async (userId: string, meterData: MeterData) => {
  try {
    // Check if meter already exists for this user
    const q = query(
      collection(db, 'meters'), 
      where('userId', '==', userId),
      where('serial', '==', meterData.serial)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Этот счётчик уже добавлен в ваш кабинет');
    }

    await addDoc(collection(db, 'meters'), {
      userId,
      serial: meterData.serial,
      account: meterData.account,
      address: meterData.address,
      createdAt: serverTimestamp(),
      lastReading: meterData.reading,
      lastUpdate: meterData.last_update,
      status: meterData.status
    });
  } catch (error) {
    console.error("Error adding meter:", error);
    throw error;
  }
};

export const getUserMeters = async (userId: string): Promise<SavedMeter[]> => {
  try {
    const q = query(
      collection(db, 'meters'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const meters = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavedMeter));

    // Sort client-side to avoid Firestore index requirements
    return meters.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting meters:", error);
    throw error;
  }
};

export const deleteMeter = async (meterId: string) => {
  try {
    await deleteDoc(doc(db, 'meters', meterId));
  } catch (error) {
    console.error("Error deleting meter:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserStat[]> => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const metersSnap = await getDocs(collection(db, 'meters'));
    
    // Group meters by user
    const userMeters: Record<string, SavedMeter[]> = {};
    metersSnap.forEach(doc => {
      const data = doc.data() as SavedMeter;
      const uid = data.userId;
      if (!userMeters[uid]) {
        userMeters[uid] = [];
      }
      userMeters[uid].push({ id: doc.id, ...data });
    });

    return usersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      meterCount: userMeters[doc.id]?.length || 0,
      meters: userMeters[doc.id] || []
    } as UserStat));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const logSearch = async (type: 'search' | 'not_found', value: string, result: string) => {
  try {
    await addDoc(collection(db, 'logs'), {
      type,
      value,
      result,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging:", error);
    // Non-blocking error
  }
};
