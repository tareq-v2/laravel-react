

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminChat.css';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentAdminId, setCurrentAdminId] = useState(null);
    const [echo, setEcho] = useState(null);
    const messagesEndRef = useRef(null);

    // Initialize Pusher & Echo
    useEffect(() => {
        const pusher = new Pusher('d9d7ec402ed53e624684', {
            cluster: 'mt1',
            forceTLS: true,
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        });

        const echoInstance = new Echo({
            broadcaster: 'pusher',
            client: pusher
        });

        setEcho(echoInstance);

        return () => {
            pusher.disconnect();
        };
    }, []);

    // Fetch current admin ID
    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/current-user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentAdminId(response.data.id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentAdmin();
    }, []);

    // Fetch conversations and setup listeners
    useEffect(() => {
        if (!currentAdminId || !echo) return;

        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/admin/conversations', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();

        // Message listener
        echo.private(`chat.${currentAdminId}`)
            .listen('NewMessage', (message) => {
                setMessages(prev => [...prev, message]);
                setConversations(prev => {
                    const existing = prev.find(c => c.sender_id === message.sender_id);
                    return existing ? prev : [...prev, message.sender];
                });
            });

        return () => {
            echo.leave(`chat.${currentAdminId}`);
        };
    }, [currentAdminId, echo]);

    // Fetch messages when user is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedUser) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/admin/messages/${selectedUser.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        fetchMessages();
    }, [selectedUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('/admin/send-message', {
                receiver_id: selectedUser.id,
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredConversations = conversations.filter(convo =>
        convo.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-chat-container">
            <div className="conversation-list">
                <div className="chat-header">
                    <h3>Conversations</h3>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="conversations">
                    {filteredConversations.map(convo => (
                        <div
                            key={convo.sender_id}
                            className={`conversation-item ${selectedUser?.id === convo.sender_id ? 'active' : ''}`}
                            onClick={() => setSelectedUser(convo.sender)} // HERE
                        >
                            <div className="user-info">
                                <span className="user-name">{convo.sender.name}</span>
                                <span className="last-message">
                                    {convo.last_message?.message || 'No messages yet'}
                                </span>
                            </div>
                            {convo.unread_count > 0 && (
                                <span className="unread-count">{convo.unread_count}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-window">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h3>Chat with {selectedUser.name}</h3>
                            <span className={`user-status ${selectedUser.is_online ? 'online' : 'offline'}`}>
                                {selectedUser.is_online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <div className="messages-container">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.sender_id === currentAdminId ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <p>{msg.message}</p>
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    {!msg.read && msg.sender_id !== auth().id() && (
                                        <span className="read-status">✓</span>
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
                    </>
                ) : (
                    <div className="select-user-prompt">
                        Select a conversation from the list
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;