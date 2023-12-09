// ChatRooms.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomDescription, setNewRoomDescription] = useState('');
    const [isDivVisible, setDivVisibility] = useState(false);

    useEffect(() => {
      // Fetch the list of rooms from the server
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/rooms`);
  
          if (!response.ok) {
            // If the response status is not OK, handle the error
            throw new Error(`Failed to fetch rooms: ${response.status}`);
          }
  
          const data = await response.json();
          setRooms(data);
        } catch (error) {
          console.error('Error fetching rooms:', error.message);
        }
      };
      
      fetchData()
      const intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }, []);

    const handleCreateRoom = async (e) => {
      // Prevent the default behavior of the button click
      e.preventDefault();
      if (newRoomName.trim() === '' || newRoomDescription.trim() === '') {
        setDivVisibility(true);
   
        return;
      }

      setDivVisibility(false);
      try {
        await fetch(`/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newRoomName, description: newRoomDescription }),
        });

        // Fetch the updated list of rooms
        const response = await fetch(`/api/rooms`);
        const data = await response.json();
        setRooms(data);

        // Clear the input field
        setNewRoomName('');
        setNewRoomDescription('');
      } catch (error) {
        console.error('Error creating room:', error);
      }
    };

  return (
    <div>
      <h2>Chat Rooms</h2>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map(room => (
            <li key={room.name}>
              <Link to={`/rooms/${room.name}/chats`}>
              <strong>{room.name}</strong></Link> - {room.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms created.</p>
      )}
      <div>
      <input
          type="text"
          placeholder="Enter room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room description"
          value={newRoomDescription}
          onChange={(e) => setNewRoomDescription(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
        {isDivVisible && (
        <div>
          {/* Your content goes here */}
          <p style={{ color: 'red' }}>Please provide both room name and description..</p>
        </div>
      )}
    </div>
      </div>
  );
};

export default ChatRooms;
