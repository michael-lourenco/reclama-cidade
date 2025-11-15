import type { Marker, StatusChange } from "@/components/marker/types/marker";
import type { UserData } from "@/components/user/types/user";
import { supabase } from "@/lib/supabaseClient";
import { PrismaClient, ProblemStatus as PrismaProblemStatus } from "@prisma/client";
import 'dotenv/config';


const prisma = new PrismaClient()
export const ProblemStatus = {
  REPORTED: PrismaProblemStatus.REPORTED,
  UNDER_ANALYSIS: PrismaProblemStatus.UNDER_ANALYSIS,
  VERIFIED: PrismaProblemStatus.VERIFIED,
  IN_PROGRESS: PrismaProblemStatus.IN_PROGRESS,
  RESOLVED: PrismaProblemStatus.RESOLVED,
  CLOSED: PrismaProblemStatus.CLOSED,
  REOPENED: PrismaProblemStatus.REOPENED,
} as const;

export type ProblemStatus = typeof ProblemStatus[keyof typeof ProblemStatus];

export interface UserMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: Date;
}

async function fetchUserData(email: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data as UserData;
}

async function updateMarkers(markerId: string, updatedData: Partial<Marker>): Promise<void> {
  try {
    await prisma.marker.update({
      where: { id: markerId },
      data: {
        lat: updatedData.lat,
        lng: updatedData.lng,
        type: updatedData.type,
        userEmail: updatedData.userEmail,
        createdAt: updatedData.createdAt instanceof Date ? updatedData.createdAt : new Date(), // Handle FirestoreTimestamp if necessary
        likedBy: updatedData.likedBy,
        resolvedBy: updatedData.resolvedBy,
        currentStatus: updatedData.currentStatus as ProblemStatus | undefined,
      },
    });
  } catch (error) {
    console.error("Error updating marker:", error);
  }
}

async function updateUserMarker(
  email: string,
  markerId: string,
  updatedData: Partial<UserMarker>
): Promise<void> {
  const { error } = await supabase
    .from("user_markers")
    .update(updatedData)
    .eq("user_email", email)
    .eq("marker_id", markerId);

  if (error) {
    console.error("Error updating user marker:", error);
  }
}

async function addMarker(marker: Marker): Promise<void> {
  try {
    await prisma.marker.create({
      data: {
        id: marker.id,
        lat: marker.lat,
        lng: marker.lng,
        type: marker.type,
        userEmail: marker.userEmail,
        createdAt: marker.createdAt instanceof Date ? marker.createdAt : new Date(), // Handle FirestoreTimestamp if necessary
        likedBy: marker.likedBy || [],
        resolvedBy: marker.resolvedBy || [],
        currentStatus: marker.currentStatus as ProblemStatus | undefined,
      },
    });
    await addStatusChange(
      marker.id,
      ProblemStatus.REPORTED,
      "Problema reportado inicialmente",
      marker.userEmail
    );
  } catch (error) {
    console.error("Error adding marker:", error);
  }
}

async function addUserMarker(email: string, marker: UserMarker): Promise<void> {
  const { error } = await supabase
    .from("user_markers")
    .insert([{ user_email: email, marker_id: marker.id, ...marker }]);

  if (error) {
    console.error("Error adding user marker:", error);
  }
}

async function removeMarker(markerId: string): Promise<void> {
  try {
    await prisma.marker.delete({
      where: { id: markerId },
    });
  } catch (error) {
    console.error("Error removing marker:", error);
  }
}

async function removeUserMarker(email: string, markerId: string): Promise<void> {
  const { error } = await supabase
    .from("user_markers")
    .delete()
    .eq("user_email", email)
    .eq("marker_id", markerId);

  if (error) {
    console.error("Error removing user marker:", error);
  }
}

async function getMarkers() {
  try {
    const markers = await prisma.marker.findMany();
    return markers;
  } catch (error) {
    console.error("Error getting markers:", error);
    return [];
  }
}

async function getUserMarkers(email: string) {
  const { data, error } = await supabase
    .from("user_markers")
    .select("*")
    .eq("user_email", email);

  if (error) {
    console.error("Error getting user markers:", error);
    return [];
  }

  return data;
}

async function updateUserCredits(email: string, value: number): Promise<void> {
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('credits')
    .eq('email', email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'not found' error
    console.error('Error fetching user credits:', fetchError);
    return;
  }

  const currentCredits = userData?.credits?.value || 0;
  const newCredits = currentCredits + value;

  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      email: email,
      credits: { value: newCredits, updatedAt: new Date().toISOString() }
    }, { onConflict: 'email' });

  if (upsertError) {
    console.error('Error updating user credits:', upsertError);
  }
}

async function updateUserCurrency(email: string, value: number): Promise<void> {
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('currency')
    .eq('email', email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user currency:', fetchError);
    return;
  }

  const currentCurrency = userData?.currency?.value || 0;
  const newCurrency = currentCurrency + value;

  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      email: email,
      currency: { value: newCurrency, updatedAt: new Date().toISOString() }
    }, { onConflict: 'email' });

  if (upsertError) {
    console.error('Error updating user currency:', upsertError);
  }
}

const updateMarkerLikes = async (markerId: string, userEmail: string) => {
  const { data, error } = await supabase.rpc('append_to_liked_by', {
    marker_id: markerId,
    user_email: userEmail
  });

  if (error) {
    console.error('Error updating marker likes:', error);
    throw error;
  }
};

const updateMarkerResolved = async (markerId: string, userEmail: string) => {
  const { data, error } = await supabase.rpc('append_to_resolved_by', {
    marker_id: markerId,
    user_email: userEmail
  });

  if (error) {
    console.error('Error updating marker resolved:', error);
    throw error;
  }

  const { data: markerData, error: markerError } = await supabase
    .from('markers')
    .select('resolvedBy')
    .eq('id', markerId)
    .single();

  if (markerData?.resolvedBy?.length >= 1) {
    await addStatusChange(markerId, ProblemStatus.RESOLVED, "Problema resolvido", userEmail);
  }
};

async function addStatusChange(
  markerId: string,
  status: ProblemStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<string> {
  try {
    const newStatusChange = await prisma.statusChange.create({
      data: {
        markerId: markerId,
        status: status,
        comment: comment,
        updatedBy: updatedBy,
      },
    });

    await updateMarkerStatus(markerId, status, comment, updatedBy);

    return newStatusChange.id;
  } catch (error) {
    console.error("Error adding status change:", error);
    throw error;
  }
}

async function updateMarkerStatus(
  markerId: string,
  newStatus: ProblemStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<void> {
  try {
    await prisma.marker.update({
      where: { id: markerId },
      data: { currentStatus: newStatus },
    });
  } catch (error) {
    console.error("Error updating marker status:", error);
  }
}

async function getMarkerStatusHistory(markerId: string): Promise<StatusChange[]> {
  try {
    const statusHistory = await prisma.statusChange.findMany({
      where: { markerId: markerId },
      orderBy: { timestamp: "desc" },
    });
    return statusHistory;
  } catch (error) {
    console.error("Error getting marker status history:", error);
    return [];
  }
}

async function removeAnonymousMarkers(): Promise<{ count: number, removedIds: string[] }> {
  try {
    const anonymousMarkers = await prisma.marker.findMany({
      where: {
        userEmail: {
          contains: 'Usuário anônimo',
        },
      },
      select: {
        id: true,
      },
    });

    const removedIds = anonymousMarkers.map(m => m.id);

    if (removedIds.length > 0) {
      await prisma.statusChange.deleteMany({
        where: {
          markerId: {
            in: removedIds,
          },
        },
      });

      await prisma.marker.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      });
    }

    return { count: removedIds.length, removedIds };
  } catch (error) {
    console.error('Error removing anonymous markers:', error);
    return { count: 0, removedIds: [] };
  }
}

async function removeMarkersByEmail(email: string): Promise<{ count: number, removedIds: string[] }> {
  if (!email || typeof email !== 'string') {
    throw new Error('E-mail inválido: deve ser uma string não vazia');
  }

  try {
    const markersToDelete = await prisma.marker.findMany({
      where: { userEmail: email },
      select: { id: true },
    });

    const removedIds = markersToDelete.map(m => m.id);

    if (removedIds.length > 0) {
      await prisma.statusChange.deleteMany({
        where: {
          markerId: {
            in: removedIds,
          },
        },
      });

      await prisma.marker.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      });
    }

    return { count: removedIds.length, removedIds };
  } catch (error) {
    console.error('Error removing markers by email:', error);
    return { count: 0, removedIds: [] };
  }
}


export {
  addMarker,
  addStatusChange,
  addUserMarker,
  fetchUserData,
  getMarkers,
  getMarkerStatusHistory,
  getUserMarkers,
  removeAnonymousMarkers,
  removeMarker,
  removeMarkersByEmail,
  removeUserMarker,
  updateMarkerLikes,
  updateMarkerResolved,
  updateMarkers,
  updateMarkerStatus,
  updateUserCredits,
  updateUserCurrency,
  updateUserMarker
};
export type { UserData };
