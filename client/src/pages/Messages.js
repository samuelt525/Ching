import { Avatar, TextField } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import ChatList from '../components/ChatList';
import TabScrollButton from '@mui/material/TabScrollButton';
import { db, auth } from '../firebase.js'

import '../styles/Messages.css'
import '../styles/Chat.css'
import { collection, query, addDoc, serverTimestamp, onSnapshot, doc, limit, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SAMLAuthProvider } from 'firebase/auth';

function Topbar() {

    return (
        <div className='topbar'>
            <Avatar>
                {/* Profile Pic */}
            </Avatar>
            <p className='ToUserName'>
                {/* Active user */}
                Sean Rhee
            </p>
        </div>
    )
}
const user = "Samuel"

function Messages() {

    const q = collection(db, `chats`)

    const FromUser = "Samuel";
    const ToUser = "Sean";
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const bottomOfChat = useRef()
    console.log(bottomOfChat)

    useEffect(() => {
        const temp = query(collection(db, 'test'), orderBy("created"), limit(60))
        const snap = onSnapshot(temp, (message) => {
            setMessages(message.docs.map(doc => doc.data()))
        })

    }, [])
    useEffect(() => {
        setTimeout(
            bottomOfChat.current.scrollIntoView({
                behavior: "smooth",
                block: 'start',
            }), 100
        )
    },[messages])

    function getMessage() {
        console.log("How many times it work")
        return messages.map(msg => {
            const sender = msg.fromUser === user;
            return (
                <div className={sender ? 'blue message' : 'green message'}>
                    <p className='black'>{msg.messages}</p>
                </div>
            )
        })

    }
    function SendMessage(text) {
        const testRef = collection(db, 'test')
        return addDoc(testRef, {
            created: serverTimestamp(),
            messages:  text,
            fromUser: FromUser,
            toUser: ToUser,
        });
    }

    return (
        <>
            <div className='container'>
                <ChatList />
                <div className='chatContainer'>
                    <Topbar />
                    <div className='messages'>
                        {getMessage()}
                    </div>
                    <TextField 
                    id="outlined-basic" 
                    label="Outlined" 
                    variant="outlined"
                    value={currentMessage}
                    onKeyPress={(e) => {
                        if (e.key === "Enter"){
                            SendMessage(e.target.value)
                            setCurrentMessage("")
                        }else{
                            setCurrentMessage(e.value)
                        }
                    }}
                    />
                    <div ref={bottomOfChat} />
                </div>
            </div>
        </>
    )
}

export default Messages