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

            // Listen for new messages
            echo.private(`chat.${selectedAdmin.id}`)
            .listen('NewMessage', (message) => {
                console.log('Received real-time message:', message);
                setMessages(prev => {
                    // Replace temporary message or add new one
                    const existingIndex = prev.findIndex(m => 
                        m.isTemporary && m.message === message.message
                    );
                    
                    if (existingIndex >= 0) {
                        const newMessages = [...prev];
                        newMessages[existingIndex] = message;
                        return newMessages;
                    }
                    return [...prev, message];
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

        const token = localStorage.getItem('token');
        const tempId = Date.now();
        
        // Create temporary message
        const tempMessage = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: selectedAdmin.id,
            message: newMessage,
            created_at: new Date().toISOString(),
            isTemporary: true,
            isFailed: false
        };

        // Optimistic update
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        try {
            console.log('Attempting to send message...'); // Debug
            const response = await axios.post('/send-message', {
                receiver_id: selectedAdmin.id,
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000 // Add timeout
            });
            
            console.log('Message sent successfully:', response.data); // Debug
            
            // If we don't get a Pusher event within 3 seconds, force update
            setTimeout(() => {
                setMessages(prev => prev.map(msg => 
                    msg.id === tempId ? { ...msg, isFailed: true } : msg
                ));
            }, 3000);
            
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => prev.map(msg => 
                msg.id === tempId ? { ...msg, isFailed: true } : msg
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