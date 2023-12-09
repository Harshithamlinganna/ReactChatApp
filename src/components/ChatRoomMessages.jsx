// components/ChatRoomMessages.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';


const ChatRoomMessages = () => {
    const { userName } = useUser();
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const fectchUser =  () => {
        fetch(`/api/users`)
        .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to get the users list ');
            }
            return response.json();
          })
        .then((userData) => {
            setUsers(userData);
            fetchRoomMessages(); // Fetch messages after users are fetched
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        });
    }

    const fetchRoomMessages = () => {
        fetch(`/api/rooms/${roomId}/chats`)
        .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch the chats messages');
            }
            return response.json();
          })
        .then((data) => {
            if (data) {
            const updatedMessages = data.map((message) => {
                const user = users.find((user) => user.publicUserId === message.posterId);
                if (user) {
                message.posterId = user.name.newName || user.name;
                }
                return message;
            });
            setMessages(updatedMessages);
            } else {
            setMessages([]);
            }
        })
        .catch((error) => console.error('Error fetching messages:', error));
    };

    useEffect(() => {
        // Fetch users
        fetch(`/api/users`)
        .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to get the users list ');
            }
            return response.json();
          })
        .then((userData) => {
            setUsers(userData);
            fetchRoomMessages(); // Fetch messages after users are fetched
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        });

        const intervalId = setInterval(fectchUser, 10000);

        return () => clearInterval(intervalId);
    }, [roomId, userName, users]);

    const handleAddMessage = () => {
        if (newMessage) {
          // Make a POST request to add a new message to the chat room
          fetch(`/api/rooms/${roomId}/chats`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageText: newMessage }),
          })
            .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
            .then(() => {
              setNewMessage('');
              fetchRoomMessages(); // Fetch messages after adding a new message
            })
            .catch((error) => {
              console.error('Error adding message:', error);
            });
        }
    };
    
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <div>
        {messages.map((message) => (
          <div key={message.timestamp}>
            <p>
              {message.posterId} @ {new Date(parseInt(message.timestamp)).toLocaleString()}:{' '}
              {message.messageText.messageText}
            </p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button onClick={handleAddMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default ChatRoomMessages;
