
export interface Event {
    id: number;
    created_at: string;
    title: string | null;
    description: string | null;
    mode: 'online' | 'offline' | string | null;
    location: string | null;
    total_seats: number | null;
    registration_deadline: string | null; // date string
    banner_url: string | null;
    luma_event_url: string | null;
}
