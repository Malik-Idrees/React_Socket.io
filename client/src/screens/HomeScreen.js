import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Item from '@mui/material/ListItem'

import {
    Link,
    Grid,
    Typography,
    TextField,
    Button,
    CardContent,
    CardActions,
    Card,
} from '@mui/material'

function HomeScreen({ socket, updateUsername, username = '', updateChatroom }) {
    let navigate = useNavigate()

    const [room, setRoom] = useState('')
    const [lobbies, setLobbies] = useState([])

    const joinRoom = ({ lobby }) => {
        if (username.trim() === '') return alert('Username is required')
        if (lobby.trim() === '')
            return alert('Please select or create a chat group')

        socket.emit('join_room', lobby)
        updateChatroom(lobby)
        navigate(`/${lobby}`)
    }

    const addRoom = () => {
        if (room.trim() === '') return alert('Please provide chatroom name')
        socket.emit('create_room', room)
        setRoom('')
        socket.emit('get_rooms')
    }

    useEffect(() => {
        socket.on('rooms', (data) => {
            setLobbies(data)
        })
        socket.emit('get_rooms')
    }, [socket])

    return (
        <Grid container spacing={2}>
            <Grid item lg={6} sm={12}>
                <Item>
                    <Typography variant='h5' component='h5'>
                        Username
                    </Typography>
                </Item>

                <Item xs={12} lg={6}>
                    <TextField
                        value={username}
                        onChange={(e) => updateUsername(e.target.value)}
                        label='User Name'
                        variant='outlined'
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                updateUsername(ev.target.value)
                            }
                        }}
                    />
                    <Button
                        onClick={(e) => updateUsername(e.target.value)}
                        variant='contained'
                        sx={{ marginLeft: 2 }}
                    >
                        Enter
                    </Button>
                </Item>
            </Grid>

            <Grid item sm={12} lg={6}>
                <Item>
                    <Typography variant='h5' component='h5'>
                        Create A Room
                    </Typography>
                </Item>

                <Item>
                    <TextField
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        label='Room Name'
                        variant='outlined'
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                addRoom()
                            }
                        }}
                    />
                    <Button
                        variant='contained'
                        sx={{ marginLeft: 2 }}
                        onClick={() => addRoom()}
                    >
                        New Chat Room
                    </Button>
                </Item>
            </Grid>

            {/* List Chat Rooms */}

            <Grid item>
                <Item>
                    <Typography
                        variant='p'
                        sx={{ marginTop: 0.5, fontSize: '22px' }}
                        component='p'
                    >
                        Username: {username}
                    </Typography>
                </Item>
                <Item xs={12}>
                    <Typography
                        variant='h5'
                        sx={{ marginTop: 0.5 }}
                        component='h5'
                    >
                        Chat Rooms
                    </Typography>
                </Item>
            </Grid>

            <Grid container spacing={2} sx={{ margin: 2 }}>
                {lobbies.map((lobby, index) => {
                    return (
                        <Grid item key={index} xs={6} md={4} lg={3}>
                            <Card variant='outlined'>
                                <CardContent sx={{ justifyContent: 'center' }}>
                                    <Typography
                                        sx={{ justifyContent: 'center' }}
                                        variant='h5'
                                        component='div'
                                    >
                                        {lobby}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Link to='#'>
                                        {' '}
                                        <Button
                                            size='small'
                                            variant='contained'
                                            onClick={() => joinRoom({ lobby })}
                                        >
                                            Join Room
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}

export default HomeScreen
