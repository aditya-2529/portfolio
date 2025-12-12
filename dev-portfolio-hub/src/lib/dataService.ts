export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import axios from 'axios';

export interface ProjectData {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
  tags: string[];
}

export interface Remark {
  _id?: string;
  clientName: string;
  companyName?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  _id: string; // MongoDB ID
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}


export const dataService = {
    sendMessage: async (data: {
        firstName: string;
        lastName: string;
        email: string;
        subject: string;
        message: string;
    }) => {
        const response = await axios.post(`${API_URL}/contact`, data);
        return response.data;
    },
    getProjects: async () => {
        const response = await axios.get(`${API_URL}/projects`);
        return response.data;
    },
    saveProject: async (project: ProjectData) => {
        const response = await axios.post(`${API_URL}/saveproject`, project);
        return response.data;
    },
    updateProject: async (id: string, project: ProjectData) => {
        const response = await axios.put(`${API_URL}/updateproject/${id}`, project);
        return response.data;
    },

    deleteProject: async (id: string) => {
        const response = await axios.delete(`${API_URL}/deleteproject/${id}`);
        return response.data;
    },
    getRemarks: async (): Promise<Remark[]> => {
        const response = await axios.get(`${API_URL}/remarks`);
        return response.data;
    },
    
    addRemark: async (remark: Omit<Remark, 'id' | 'isApproved' | 'createdAt'>) => {
        const response = await axios.post(`${API_URL}/addremark`, remark);
        return response.data;
    },

    toggleRemarkApproval: async (id: string, isApproved: boolean) => {
        const response = await axios.put(`${API_URL}/toggleapproval/${id}`, { isApproved });
        return response.data;
    },

    deleteRemark: async (id: string) => {
        const response = await axios.delete(`${API_URL}/deleteremark/${id}`);
        return response.data;
    },

    getMessages: async (): Promise<ContactMessage[]> => {
        const response = await axios.get(`${API_URL}/contacts`);
        return response.data;
    },

    deleteMessage: async (id: string) => {
        const response = await axios.delete(`${API_URL}/deletecontact/${id}`);
        return response.data;
    }
};