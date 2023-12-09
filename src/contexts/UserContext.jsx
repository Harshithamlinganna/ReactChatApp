// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
const UserContext = createContext();

const fetchUserName = (users, publicUserId) => {

  const userDetails = users.find((user) => user.publicUserId === publicUserId);
  const name =  userDetails.name.newName || userDetails.name || ' '
  return name

}
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users`);
        if (!response.ok) {
          // If the response status is not OK, handle the error
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        const users = await response.json();
        const publicUserIdFromCookie = Cookies.get('publicUserId');
        const name = fetchUserName(users,publicUserIdFromCookie )
        setUserName(name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const updateUsername = (newUsername) => {
    setUserName(newUsername);
  };

  return (
    <UserContext.Provider value={{ userName, updateUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
