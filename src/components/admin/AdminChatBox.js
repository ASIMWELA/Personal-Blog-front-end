import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { authenticateAdmin } from '../../utils/AuthUtils'
import { chatActiveContact } from '../../contex'
import { message } from 'antd'
import { useRecoilState } from "recoil";
import { findChatMessages, countNewMessages, getUsers } from '../../utils/APIUtils'
import { BASE_MESSAGING_URL } from '../../constants'
import ScrollToBottom from 'react-scroll-to-bottom'
import { Button } from 'antd'
import { FaPaperPlane } from 'react-icons/fa'
import './adminChatBox.css'
import userImage from '../../userImage.png'
import { now } from 'jquery'

let stompClient = null
export default function AdminChatBox() {

    const history = useHistory()
    const [privateMessages, setPrivateChatMessages] = useState([])
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact)
    const [contacts, setContacts] = useState([])

    let initialState = {
        onlineUsers: null,
        channelConnected: false,
        error: '',
        privateChatMessage: '',
        bulkMessages: null,
        openNotifications: false,
    }

    let [state, setState] = useState(initialState);

    const isAdminAuthentcated = authenticateAdmin()



    let adminLoggedIn = null
    let token = null

    if (isAdminAuthentcated) {

        adminLoggedIn = JSON.parse(localStorage.getItem('admin')).user
        token = JSON.parse(localStorage.getItem('admin')).access_TOKEN
    }
    else {
        history.push("/login")
    }

    useEffect(() => {
        if (!localStorage.admin) {
            history.push("/login")
        }
        connectToServer()
        loadContacts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeContact === undefined) return;
        findChatMessages(activeContact.uid, adminLoggedIn.uid, token).then((msg) =>
            setPrivateChatMessages(msg)
        )
        loadContacts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeContact])


    const connectToServer = () => {
        if (adminLoggedIn) {
            var Stomp = require('stompjs')
            var SockJS = require('sockjs-client')
            SockJS = new SockJS(BASE_MESSAGING_URL + '/ws')
            stompClient = Stomp.over(SockJS)
            stompClient.connect({}, onConnected, onError);
        }
    }
    const onError = (error) => {
        setState({
            error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
        })
    }
    //const disconnect = () => {
    //     stompClient.unsubscribe("privateChat", {})
    //     stompClient.disconnect(() => { console.log("Disconnected") }, {})
    // }
    const onConnected = () => {
        setState({
            ...state,
            channelConnected: true
        })
        // Subscribing to the private topic

        stompClient.subscribe('/user/' + adminLoggedIn.uid + "/queue/messages", onPrivateMessageReceived, { id: "privateChat" });

        stompClient.send("/app/toggleAdmin", {}, JSON.stringify({ sender: adminLoggedIn.userName, type: "JOIN" }))

    }

    const disconnect = () => {
        var message = {
            sender: adminLoggedIn.userName,
            type: "LEAVE"
        }
        stompClient.send('/app/toggleAdmin', {}, JSON.stringify(message));
        stompClient.unsubscribe("privateChat", {})
        stompClient.disconnect(() => { console.log("Disconnected") }, {})
        history.push("/admin/projects")


    }

    const onPrivateMessageReceived = (payload) => {
        const notification = JSON.parse(payload.body);

        const active = JSON.parse(localStorage.getItem("recoil-persist"))
            .chatActiveContact;

        if (!active.uid) return
        if (active.uid === notification.senderId) {
            findChatMessages(active.uid, adminLoggedIn.uid, token).then((msg) => {
                const newMessages = [...privateMessages]
                msg.forEach((m) => newMessages.push(m))
                setPrivateChatMessages(newMessages);
            }
            )
        }
        else {
            message.info('received a new message from ' + notification.senderName)
        }
        loadContacts()
    }
    const sendPrivateMessage = () => {
        const message = {
            senderId: adminLoggedIn.uid,
            recipientId: activeContact.uid,
            sender: adminLoggedIn.userName,
            receiver: activeContact.userName,
            content: state.privateChatMessage
        };

        stompClient.send("/app/privateChat", {}, JSON.stringify(message));

        const newMessages = [...privateMessages];
        newMessages.push(message);
        setPrivateChatMessages(newMessages);

    };

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const loadContacts = async () => {
        const promise = getUsers().then((users) =>
            users._embedded.userList.map((contact) =>
                countNewMessages(contact.uid, adminLoggedIn.uid, token).then((count) => {
                    contact.newMessages = count;
                    return contact;
                })
            )

        );
        await promise.then((promises) =>
            Promise.all(promises).then((users) => {
                const subscribers = users.filter(user => {
                    return !('projects' in user._links)
                })
                setContacts(subscribers);
                if (activeContact === undefined && subscribers.length > 0) {
                    setActiveContact(subscribers[0]);

                }
            })
        );
    };



    const handleTyping = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })

        //sendMessage("TYPING", event.target.value)
    }
    //console.log(privateMessages)
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    <div style={{ width: "100%", height: "fit-content", color: "white", textAlign: "center", fontSize: "1.5rem", backgroundColor: "#1abc9c" }}>CONTACTS</div>
                    <div>
                        <ul className="contacts-list">
                            {
                                contacts.map((contact) => (
                                    <li
                                        key={contact.uid}
                                        onClick={() => setActiveContact(contact)}
                                        className={
                                            activeContact && contact.uid === activeContact.uid
                                                ? "contact active"
                                                : "contact"
                                        }
                                    >
                                        {contact.online ? <span>{contact.userName} online</span> : <span>{contact.userName}</span>}
                                        <br />
                                        {contact.newMessages !== undefined &&
                                            contact.newMessages > 0 && (
                                                <span className="preview">
                                                    {contact.newMessages > 1 ? <span>{contact.newMessages} New messages</span> : <span>{contact.newMessages} New message</span>}
                                                </span>
                                            )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-7">
                    <div id="frame">
                        <strong>{activeContact && <span>A chat history with {activeContact.userName}</span>}</strong>
                        <ScrollToBottom className="messages">
                            <ul>
                                {privateMessages.map((msg) => (
                                    <li key={msg.id || (Math.random() * 20 + new Date(now()))}
                                        className={msg.senderId === adminLoggedIn.uid ? "sent" : "replies"}>
                                        {msg.senderId !== adminLoggedIn.uid && (
                                            <img src={userImage} alt="" className="img-circle" style={{ width: "6%", height: "6%" }} />
                                        )}
                                        <p>{msg.content}<br /><small style={{ float: "right" }}>{msg.createdAt ? formatAMPM(new Date(msg.createdAt)) : formatAMPM(new Date())}</small></p>
                                    </li>
                                ))}
                            </ul>

                        </ScrollToBottom>
                        <div className="message-input">
                            <div className="wrap">
                                <input
                                    name="privateChatMessage"
                                    id="privateChatMessage"
                                    size="large"
                                    placeholder="Write your message..."
                                    value={state.privateChatMessage}
                                    onChange={handleTyping}
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            sendPrivateMessage();
                                            setState({ ...state, privateChatMessage: '' })

                                        }
                                    }}
                                />
                                <Button
                                    icon={<FaPaperPlane />}
                                    onClick={disconnect}
                                />
                                <Button
                                    icon={<FaPaperPlane />}
                                    onClick={() => {
                                        sendPrivateMessage();
                                        setState({ ...state, privateChatMessage: '' })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
