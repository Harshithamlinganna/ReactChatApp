// src/components/UsernameChanger.js
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const UsernameChanger = () => {
  const { userName, updateUsername } = useUser();
  console.log("currentUser updateUsername", userName, updateUsername)
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(userName || '');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateName = async () => {
    if (newUsername) {
      try {
        // Make a request to the server to update the username
        const response = await fetch(`/api/account/name`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newName: newUsername }),
        });
        if (!response.ok) {
          // If the server responds with an error, handle it here
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update username');
        }
        // Update the username using the context function
        updateUsername(newUsername);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewUsername(e.target.value);
  };

  return (
    <div>
      <span style={{ marginRight: '5px', cursor: 'pointer' }} onClick={handleEditToggle}>
        {userName && (
          <>
            {userName}
            <span role="img" aria-label="pencil">
              ✏️
            </span>
          </>
        )}
      </span>
      {isEditing && (
        <div>
          <input
            type="text"
            placeholder="Enter new name"
            value={newUsername}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateName}>Update Name</button>
        </div>
      )}
    </div>
  );
};

export default UsernameChanger;
