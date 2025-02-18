export interface Service {
    id: number;
    name: string;
    description: string;
}

export interface ServiceResponse {
    success: boolean;
    data?: Service | Service[];
    message?: string;
}
