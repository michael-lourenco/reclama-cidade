
export interface FirestoreTimestamp {
    toDate: () => Date;
    seconds: number;
    nanoseconds: number;
}

export interface Marker {
    id: string;
    lat: number;
    lng: number;
    type: string;
    userEmail: string;
    createdAt: Date | FirestoreTimestamp;
    likedBy?: string[];
    currentStatus: string; 
}

export interface StatusChange {
    id: string;
    status: string;
    timestamp: Date | FirestoreTimestamp;
    updatedBy: string;
}
