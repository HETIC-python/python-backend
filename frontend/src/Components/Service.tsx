import React from 'react';
import { Service } from './types/service';

interface ServiceProps {
    service: Service;
    onDelete: (id: number) => void;
    onEdit: (service: Service) => void;
}

const ServiceComponent: React.FC<ServiceProps> = ({ service, onDelete, onEdit }) => {
    return (
        <div className="border p-4 mb-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => onEdit(service)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(service.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceComponent;
