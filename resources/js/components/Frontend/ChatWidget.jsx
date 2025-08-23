import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import './Design/ChatWidget.css';

const ChatWidget = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [echo, setEcho] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // Added current user ID state
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize Pusher and Echo
        const pusherClient = new Pusher('d9d7ec402ed53e624684', {
            cluster: 'mt1',
            forceTLS: true,
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                }
            }
        });

        const echoInstance = new Echo({
            broadcaster: 'pusher',
            client: pusherClient,
            auth: {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        });

        // const echoInstance = new Echo({
        //     broadcaster: 'pusher',
        //     client: pusherClient
        // });

        setEcho(echoInstance);

        // Fetch current user ID
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUserId(response.data.id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        // Fetch active admins
        const fetchAdmins = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/active-admins', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdmins(response.data.admins || response.data);
            } catch (error) {
                console.error('Error fetching admins:', error);
                setAdmins([]);
            }
        };

        fetchCurrentUser();
        fetchAdmins();

        return () => {
            echoInstance.leave(`chat.${selectedAdmin?.id}`);
            pusherClient.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedAdmin && echo) {
            // Fetch messages
            const fetchMessages = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/messages/${selectedAdmin.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();

            echo.private(`chat.${selectedAdmin.id}`)
                .listen('.NewMessage', (payload) => { // Note the dot prefix
                    console.log('Received real-time message:', payload);
                    setMessages(prev => {
                        const existingIndex = prev.findIndex(m => 
                            m.tempId === payload.tempId // Match by tempId
                        );
                        
                        if (existingIndex >= 0) {
                            const newMessages = [...prev];
                            newMessages[existingIndex] = {
                                ...payload.message,
                                id: payload.message.id // use real ID
                            };
                            return newMessages;
                        }
                        return [...prev, payload.message];
                    });
                });
        }
    }, [selectedAdmin, echo]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUserId) return;

        const tempId = Date.now();
        const tempMessage = {
            tempId, // Store tempId here
            sender_id: currentUserId,
            receiver_id: selectedAdmin.id,
            message: newMessage,
            isTemporary: true
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        try {
            await axios.post('/send-message', {
                receiver_id: selectedAdmin.id,
                message: newMessage,
                tempId // Send to backend
            }, { 
                headers: { Authorization: `Bearer ${token}` }
            });

        } catch (error) {
            // Mark as failed
            setMessages(prev => prev.map(msg => 
                msg.tempId === tempId ? { ...msg, isFailed: true } : msg
            ));
        }
    };

    return (
        <div className="chat-widget">
            <div className="admin-list">
                <h4>Active Admins</h4>
                {admins.map(admin => (
                    <div 
                        key={admin.id} 
                        className={`admin-item ${selectedAdmin?.id === admin.id ? 'active' : ''}`}
                        onClick={() => setSelectedAdmin(admin)}
                    >
                        {admin.name}
                    </div>
                ))}
            </div>

            {selectedAdmin && (
                <div className="chat-container">
                    <div className="chat-header">
                        Chat with {selectedAdmin.name}
                    </div>
                    <div className="messages-container">
                        {messages.map(msg => (
                            <div 
                                key={msg.id} 
                                className={`message ${msg.sender_id === selectedAdmin.id ? 'received' : 'sent'} ${
                                    msg.isTemporary ? 'temporary' : ''
                                }`}
                            >
                                <p>{msg.message}</p>
                                {msg.isTemporary ? (
                                    <span className="status">Sending...</span>
                                ) : (
                                    <span className="time">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;