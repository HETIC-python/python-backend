import React, { useState, useEffect } from 'react';
import RequestComponent from './Request';
import { Request, RequestResponse } from './types/request';
import { API_URL } from '../api';
import { Car } from './types/car';
import { User } from './types/user';
import { useUser } from '../context/user';
import { useNavigate } from "react-router";

const Requests: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingRequest, setEditingRequest] = useState<Request | null>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userHasAdminRole,setUserHasAdminRole] = useState(false);
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null);
    const { updateUser, isAuthenticated } = useUser();
    

    const [formData, setFormData] = useState({
        type: '',
        description: '',
        start_date: '',
        end_date: '',
        price: '',
        car_id: '',
        status:'',
        user_id: user?.id.toString()
    });

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const requestsUrl =  `${API_URL}/requests`  
                
            const response = await fetch(requestsUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data: RequestResponse = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error(error);
            setError('Erreur lors du chargement des requêtes');
        } finally {
            setIsLoading(false);
        }
    };

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
            setUser(data);
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

      
    useEffect(() => {
        fetchRequests();
    }, [user]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${API_URL}/cars`);
                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error('Erreur lors du chargement des voitures:', error);
            }
        };

        fetchCars();
    }, []);

    useEffect(() => {
        if (userHasAdminRole) {
            const fetchUsers = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('No token found');
                    }

                    const response = await fetch(`${API_URL}/users`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();
                    if (data.success) {
                        setUsers(data.data);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement des utilisateurs:', error);
                }
            };

            fetchUsers();
        }
    }, [userHasAdminRole]);

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingRequest 
                ? `${API_URL}/requests/${editingRequest.id}`
                : `${API_URL}/requests`;
            
            const method = editingRequest ? 'PUT' : 'POST';
            
            const requestData = editingRequest 
                ? formData 
                : { ...formData, status: 'new' };
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data: RequestResponse = await response.json();
            
            if (data.success) {
                await fetchRequests();
                setShowForm(false);
                setFormData({ type: '', description: '', start_date: '', end_date: '', price: '', status: 'new', car_id: '', user_id: user?.id.toString() });
                setEditingRequest(null);
            }
        } catch (error) {
            console.error(error);
            setError('Erreur lors de l\'enregistrement de la requête');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette requête ?')) {
            try {
                const response = await fetch(`${API_URL}/requests/${id}`, {
                    method: 'DELETE',
                });
                const data: RequestResponse = await response.json();
                if (data.success) {
                    await fetchRequests();
                }
            } catch (error) {
                console.error(error);
                setError('Erreur lors de la suppression de la requête');
            }
        }
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Mes Requêtes</h2>
                <button
                    onClick={() => {
                        setEditingRequest(null);
                        setFormData({
                            type: '',
                            description: '',
                            start_date: '',
                            end_date: '',
                            price: '',
                            car_id: '',
                            'status':'',
                            user_id: user?.id.toString()
                        });
                        setShowForm(!showForm);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                >
                    {showForm ? 'Fermer' : 'Nouvelle requête'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                        {editingRequest ? 'Modifier la requête' : 'Nouvelle requête'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!editingRequest && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de requête
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Sélectionnez un type</option>
                                        <option value="rent">Location</option>
                                        <option value="buy">Achat</option>
                                        <option value="trade-in">Reprise</option>
                                    </select>
                                </div>
                            )}

                            {editingRequest && userHasAdminRole && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Statut
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="new">Nouveau</option>
                                        <option value="pending">En attente</option>
                                        <option value="on-processing">En cours de traitement</option>
                                        <option value="accepted">Accepté</option>
                                        <option value="rejected">Rejeté</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Prix en euros"
                                />
                            </div>

                            {!editingRequest && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Voiture
                                    </label>
                                    <select
                                        name="car_id"
                                        value={formData.car_id}
                                        onChange={(e) => setFormData({...formData, car_id: e.target.value})}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Sélectionnez une voiture</option>
                                        {cars.map(car => (
                                            <option key={car.id} value={car.id}>
                                                {car.brand} {car.model}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {!editingRequest && userHasAdminRole && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Utilisateur
                                    </label>
                                    <select
                                        name="user_id"
                                        value={formData.user_id}
                                        onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Sélectionnez un utilisateur</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.firstname} {user.lastname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full p-2 border rounded-md"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                {editingRequest ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {requests.map((request) => (
                    <RequestComponent
                        key={request.id}
                        request={request}
                        onDelete={handleDelete}
                        onEdit={(req) => {
                            setEditingRequest(req);
                            setFormData({
                                type: req.type,
                                description: req.description || '',
                                start_date: req.start_date.split('T')[0],
                                end_date: req.end_date ? req.end_date.split('T')[0] : '',
                                price: req.price?.toString() || '',
                                status: req.status,
                                car_id: req.car_id?.toString() || '',
                                user_id: req.user_id?.toString() || ''
                            });
                            setShowForm(true);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Requests; 