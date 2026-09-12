// CRUD service for Classroom Equipment Tracker (Firebase Realtime Database).
import { db } from "@/firebase";
import { ref, push, set, update, remove, onValue } from "firebase/database";

export interface Equipment {
  id?: string;
  name: string;
  quantity: number;
  location: string;
  condition: "Good" | "Fair" | "Damaged";
  available: boolean;
  photo?: string;
  createdAt?: number;
}

const equipmentRef = ref(db, "equipment");

// CREATE
export function addEquipment(item: Omit<Equipment, "id">) {
  const newRef = push(equipmentRef);
  return set(newRef, { ...item, createdAt: Date.now() });
}

// UPDATE
export function updateEquipment(id: string, changes: Partial<Equipment>) {
  return update(ref(db, `equipment/${id}`), changes);
}

// DELETE
export function deleteEquipment(id: string) {
  return remove(ref(db, `equipment/${id}`));
}

// READ (real-time). Returns an unsubscribe function.
export function listenEquipment(callback: (items: Equipment[]) => void) {
  return onValue(equipmentRef, (snapshot) => {
    const data = snapshot.val() || {};
    const items: Equipment[] = Object.entries(data).map(([id, value]) => ({
      id,
      ...(value as Equipment),
    }));
    // Newest first.
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  });
}
