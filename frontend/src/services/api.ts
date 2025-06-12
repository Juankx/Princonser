import axios from 'axios';
import { LoginCredentials, RegisterData, DashboardData, Child, Product, Invitation } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        
        const response = await axios.post(`${API_URL}/representatives/token`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/representatives/', data);
        return response.data;
    },
};

export const dashboardService = {
    getDashboard: async (): Promise<DashboardData> => {
        const response = await api.get('/representatives/me');
        return response.data;
    },
};

export const childrenService = {
    getChildren: async (): Promise<Child[]> => {
        const response = await api.get('/children/');
        return response.data;
    },

    createChild: async (child: Omit<Child, 'id' | 'representative_id'>): Promise<Child> => {
        const response = await api.post('/children/', child);
        return response.data;
    },

    updateChild: async (id: number, child: Partial<Child>): Promise<Child> => {
        const response = await api.put(`/children/${id}`, child);
        return response.data;
    },

    deleteChild: async (id: number): Promise<void> => {
        await api.delete(`/children/${id}`);
    },
};

export const productsService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get('/products/');
        return response.data;
    },

    createProduct: async (product: Omit<Product, 'id' | 'representative_id'>): Promise<Product> => {
        const response = await api.post('/products/', product);
        return response.data;
    },

    updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
        const response = await api.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};

export const invitationsService = {
    getInvitations: async (): Promise<Invitation[]> => {
        const response = await api.get('/invites/');
        return response.data;
    },

    createInvitation: async (): Promise<Invitation> => {
        const response = await api.post('/invites/');
        return response.data;
    },

    validateInvitation: async (code: string): Promise<Invitation> => {
        const response = await api.post(`/invites/validate/${code}`);
        return response.data;
    },

    useInvitation: async (code: string): Promise<Invitation> => {
        const response = await api.post(`/invites/use/${code}`);
        return response.data;
    },
}; 