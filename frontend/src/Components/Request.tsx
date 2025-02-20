import React from 'react';
import { Request } from './types/request';

interface RequestProps {
    request: Request;
    onDelete: (id: number) => void;
    onEdit: (request: Request) => void;
}

const getTypeLabel = (type: string): string => {
    switch (type) {
        case 'rent':
            return 'Location';
        case 'buy':
            return 'Achat';
        case 'trade-in':
            return 'Reprise';
        default:
            return type;
    }
};

const RequestComponent: React.FC<RequestProps> = ({ request, onDelete, onEdit }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                            ${request.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'on-processing' ? 'bg-orange-100 text-orange-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`}>
                            {request.status === 'new' ? 'Nouveau' :
                             request.status === 'pending' ? 'En attente' :
                             request.status === 'on-processing' ? 'En cours' :
                             request.status === 'rejected' ? 'Rejeté' :
                             request.status === 'accepted' ? 'Accepté' :
                             request.status}
                        </span>
                        <h3 className="text-xl font-bold mt-2">Demande de {getTypeLabel(request.type)}</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(request)}
                            className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(request.id)}
                            className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-600">
                    <div>
                        <p className="font-semibold">Date de début</p>
                        <p>{new Date(request.start_date).toLocaleDateString()}</p>
                    </div>
                    {request.end_date && (
                        <div>
                            <p className="font-semibold">Date de fin</p>
                            <p>{new Date(request.end_date).toLocaleDateString()}</p>
                        </div>
                    )}
                    {request.price && (
                        <div>
                            <p className="font-semibold">Prix</p>
                            <p>{request.price}€</p>
                        </div>
                    )}
                </div>

                {request.description && (
                    <div className="mt-2 text-gray-600">
                        <p className="font-semibold">Description</p>
                        <p className="text-sm">{request.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestComponent; 