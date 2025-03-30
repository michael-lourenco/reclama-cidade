
export interface FirestoreTimestamp {
    toDate: () => Date;
    seconds: number;
    nanoseconds: number;
}
export interface Marker {
    id: string
    lat: number
    lng: number
    type: string
    userEmail: string
    createdAt: Date | FirestoreTimestamp // Using specific type instead of any
    likedBy?: string[]
}