
export interface Marker {
    id: string;
    lat: number;
    lng: number;
    type: string;
    userEmail: string;
    createdAt: Date;
    likedBy?: string[] 
}
