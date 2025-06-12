export interface Representative {
    id: number;
    full_name: string;
    birth_date: string;
    country: string;
    email: string;
    phone?: string;
    is_active: boolean;
}

export interface Child {
    id: number;
    full_name: string;
    birth_date: string;
    country: string;
    representative_id: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    representative_id: number;
}

export interface Invitation {
    id: number;
    code: string;
    is_used: boolean;
    created_at: string;
    used_at?: string;
    sender_id: number;
}

export interface DashboardData {
    representative: Representative;
    children: Child[];
    products: Product[];
    invitations: Invitation[];
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    full_name: string;
    birth_date: string;
    country: string;
    email: string;
    phone?: string;
    password: string;
} 