export interface Request {
    id: number;
    type: string;
    status: string;
    user_id: number;
    car_id: number;
    start_date: string;
    end_date?: string;
    created_at: string;
    price?: number;
    description?: string;
}

export interface RequestResponse {
    success: boolean;
    data?: Request | Request[];
    message?: string;
} 