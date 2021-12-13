import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import io from 'socket.io-client'

const server = 'https://thawing-waters-91325.herokuapp.com'

const socket = io.connect(server)

function App() {
    const [username, setUsername] = useState('Awan')
    const [chatroom, setChatroom] = useState('Awan')

    const updateUsername = (e) => {
        setUsername(e)
    }

    const updateChatroom = (e) => {
        setChatroom(e)
    }

    return (
        <Router>
            <Routes>
                <Route
                    path='/'
                    element={
                        <HomeScreen
                            socket={socket}
                            updateChatroom={updateChatroom}
                            username={username}
                            updateUsername={updateUsername}
                        />
                    }
                />
                <Route
                    path='/:id'
                    element={
                        <ChatScreen
                            socket={socket}
                            username={username}
                            room={chatroom}
                        />
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
