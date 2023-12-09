// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatRooms from './components/ChatRooms';
import ChatRoomMessages from './components/ChatRoomMessages';
import UsernameChanger from './components/UsernameChanger';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <div>
        <header style={{ marginBottom: '20px', padding: '10px' }}>
          <h1 style={{ margin: 0 }}>Concord Chat App</h1>
          <UsernameChanger />
        </header>
        <main>
          <Router>
            <ChatRooms />
            <Routes>
              <Route path="/rooms/:roomId/chats" element={<ChatRoomMessages />} />
            </Routes>
          </Router>
        </main>
      </div>
    </UserProvider>
  );
};

export default App;
