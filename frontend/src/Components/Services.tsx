import React, { useState, useEffect } from 'react';
import ServiceComponent from './Service';
import { Service, ServiceResponse } from './types/service';
import { API_URL } from "../api";
import { useUser } from '../context/user'; 
import { useNavigate } from "react-router";

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { updateUser, isAuthenticated } = useUser();
    const [userHasAdminRole,setUserHasAdminRole] = useState(false);

    const navigate = useNavigate()
    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        description: ''
    });
    const [editingService, setEditingService] = useState<Service | null>(null);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_URL}/services`);
            const data: ServiceResponse = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setServices(data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des services');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);


    useEffect(() => {
        const fetchUser = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token || !isAuthenticated) {
               navigate('/user/login', { replace: true });
              return;
            }
    
            const response = await fetch(`${API_URL}/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch user');
            }
    
            const data = await response.json();
            updateUser(data);
            setUserHasAdminRole(data.role=="admin")
          } catch (err) {
            console.error('Error fetching user:', err);
            setError(err instanceof Error ? err.message : 'Error fetching user data');
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchUser();
      }, [isAuthenticated]); // removed updateUser from dependencies

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingService ? `${API_URL}/services/${editingService.id}` : `${API_URL}/services`;
            const method = editingService ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data: ServiceResponse = await response.json();
            
            if (data.success) {
                await fetchServices();
                setShowForm(false);
                setFormData({ name: '', description: '' });
                setEditingService(null);
            }
        } catch (err) {
            setError('Erreur lors de l\'enregistrement du service');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
            try {
                const response = await fetch(`${API_URL}/services/${id}`, {
                    method: 'DELETE',
                });
                const data: ServiceResponse = await response.json();
                if (data.success) {
                    await fetchServices();
                }
            } catch (err) {
                setError('Erreur lors de la suppression du service');
            }
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
        });
        setShowForm(true);
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
        
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Services</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {showForm ? 'Fermer' : 'Ajouter un service'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
                    <div className="mb-4">
                        <label className="block mb-2">Nom:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {editingService ? 'Modifier' : 'Ajouter'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {services.map((service) => (
                    <ServiceComponent
                        key={service.id}
                        service={service}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services; 