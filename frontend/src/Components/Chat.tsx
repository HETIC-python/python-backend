import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { API_URL } from "../api";


interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/rag/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userMessage }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Icône flottante */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all z-50 ${isOpen ? 'hidden' : ''}`}
            >
                <FaComments size={24} />
            </button>

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b bg-blue-500 text-white rounded-t-lg">
                        <h3 className="font-semibold">Assistant IA</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-200 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Zone des messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 ${
                                    message.role === 'user' ? 'text-right' : 'text-left'
                                }`}
                            >
                                <div
                                    className={`inline-block p-3 rounded-lg ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-left">
                                <div className="inline-block p-3 rounded-lg bg-gray-100">
                                    En train d'écrire...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Zone de saisie */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chat; 