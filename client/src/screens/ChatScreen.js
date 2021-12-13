import React, { useEffect, useState, useRef } from 'react'
import './chat.css'
import { Typography, TextField, Button, Stack } from '@mui/material'
import Item from '@mui/material/ListItem'
import List from '@mui/material/List'

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const scrollRef = useRef(null)

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ':' +
                    new Date(Date.now()).getMinutes(),
            }

            await socket.emit('send_message', messageData)
            setMessageList((list) => [...list, messageData])
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        if (scrollRef) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
            // scrollRef.current.scrollIntoView({ behaviour: 'smooth' })
        }
    }, [messageList])

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log('received', data)
            setMessageList((list) => [...list, data])
        })

        if (scrollRef) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
            // scrollRef.current.scrollIntoView({ behaviour: 'smooth' })
        }
    }, [socket])

    return (
        <Stack
            direction='column'
            justifyContent='space-between'
            alignItems='center'
            spacing={2}
            sx={{ maxHeight: '100vh' }}
        >
            <Item>
                <Typography variant='h5' component='h5'>
                    CHAT ROOM: {room}
                </Typography>
            </Item>

            <Item>
                <List
                    ref={scrollRef}
                    sx={{
                        width: '90%',
                        maxWidth: 1250,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        alignItems: 'end',
                        justifySelf: 'start',
                        margin: '20px auto',
                        overflow: 'hidden',
                        overflowY: 'auto',

                        height: '55vh',
                        minHeight: '55vh',
                        '& ul': { padding: 0 },
                    }}
                >
                    {messageList.map((chat, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <p className='chat-text'>
                                    {chat.author} : <span>{chat.message}</span>
                                </p>
                                <span
                                    style={{
                                        fontSize: '10px',
                                        backgroundColor: 'white',
                                        marginRight: '200px',
                                        color: 'black',
                                    }}
                                >
                                    {chat.time}
                                </span>
                            </div>
                        )
                    })}
                </List>
            </Item>

            <Item>
                <TextField
                    sx={{
                        width: '80vw',
                    }}
                    label='Message'
                    variant='outlined'
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            sendMessage()
                        }
                    }}
                />
                <Button
                    variant='contained'
                    sx={{
                        width: '15vw',
                        marginLeft: 2,
                        padding: 2,
                    }}
                    onClick={() => sendMessage()}
                >
                    Send
                </Button>
            </Item>
        </Stack>
    )
}

export default Chat
