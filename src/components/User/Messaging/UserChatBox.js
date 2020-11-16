import React, { useState, useEffect } from 'react';
import { authenticateUser } from '../../../utils/AuthUtils'
import { findChatMessages, getUsers, countNewMessages, getGroupMessages } from '../../../utils/APIUtils'
import ScrollToBottom from 'react-scroll-to-bottom'
import { Button } from 'antd'
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa'
import { Link, useHistory } from 'react-router-dom'
import { BASE_MESSAGING_URL } from '../../../constants'
import { pageAdmin } from '../../../contex'
import { useRecoilState } from 'recoil'
import userImage from '../../../userImage.png'
import './UserChatBox.css';

var stompClient = null;
export default function ChatMessageBox() {

    const history = useHistory()
    const [admin, setAdmin] = useRecoilState(pageAdmin)
    const [privateMessages, setPrivateChatMessages] = useState([])
    const [groupMessages, setGroupMessages] = useState([])

    const initialState = {
        onlineUsers: null,
        channelConnected: false,
        chatMessage: '',
        error: '',
        privateChatMessage: '',
        bulkMessages: [],
        openNotifications: false,
    }

    let [state, setState] = useState(initialState);

    const isUserAuthenticated = authenticateUser()

    let userNameLocalSrg = null
    let userObj = null;
    let userLoggedIn = null
    let token = null
    let onlineUsers = 0
    if (isUserAuthenticated) {
        userObj = JSON.parse(localStorage.getItem('user'))
        token = userObj.access_TOKEN
        userLoggedIn = JSON.parse(localStorage.getItem('user')).user
        userNameLocalSrg = userLoggedIn.userName

    }
    else {
        history.push("/login")
    }
    useEffect(() => {
        if (!localStorage.user) {
            history.push("/login")
        }

        connectToServer()
        loadContacts()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getGroupMessages().then(res => {
            setGroupMessages(res)
        })

        if (admin === undefined) {
            return
        }
        findChatMessages(admin.uid, userLoggedIn.uid, token).then((msg) => {
            setPrivateChatMessages(msg)
        })



        loadContacts()


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [admin])

    const handleTyping = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })

    }

    const connectToServer = () => {

        if (userNameLocalSrg) {
            var Stomp = require('stompjs')
            var SockJS = require('sockjs-client')
            SockJS = new SockJS(BASE_MESSAGING_URL + '/ws')
            stompClient = Stomp.over(SockJS)
            stompClient.connect({}, onConnected, onError);
        }
    }
    const disconnect = () => {
        var message = {
            sender: userNameLocalSrg,
            type: "LEAVE"
        }
        stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
        stompClient.unsubscribe("publicChat", {})
        stompClient.disconnect(() => { console.log("Disconnected") }, {})
        document.querySelector(".admin-chatbox").style.display = "none"

        setState({
            channelConnected: false
        })

    }
    const onConnected = () => {
        setState({
            ...state,
            channelConnected: true
        })
        // Subscribing to the public topic
        stompClient.subscribe('/topic/public', onMessageReceived, { id: "publicChat" });
        stompClient.subscribe('/user/' + userObj.user.uid + "/queue/messages", onPrivateMessageReceived, { id: "privateChat" });

        //send join message
        stompClient.send("/app/addUser", {}, JSON.stringify({ sender: userNameLocalSrg, type: "JOIN" }))


    }
    const onPrivateMessageReceived = (payload) => {

        //console.log(payload)
        const notification = JSON.parse(payload.body);

        const pageAdm = JSON.parse(localStorage.getItem("recoil-persist")).pageAdmin
        if (pageAdm === undefined) {
            return
        }

        if (pageAdm.uid === notification.senderId) {
            findChatMessages(pageAdm.uid, userLoggedIn.uid, token).then((msg) => {
                const newMessages = [...privateMessages]
                msg.forEach((m) => newMessages.push(m))
                setPrivateChatMessages(newMessages);
            }
            )
        }

        loadContacts()

    }

    const loadContacts = () => {
        if (!token) return
        const promise = getUsers().then((users) =>
            users._embedded.userList.map((contact) =>
                countNewMessages(contact.uid, userLoggedIn.uid, token).then((count) => {
                    contact.newMessages = count;
                    return contact;
                })
            )

        );
        promise.then((promises) =>
            Promise.all(promises).then((users) => {
                const adminData = users.filter(user => {
                    return 'projects' in user._links
                })

                if (admin === undefined) {
                    setAdmin(adminData[0]);

                }
            })
        );
    };


    const sendPrivateMessage = () => {

        const message = {
            senderId: userLoggedIn.uid,
            recipientId: admin.uid,
            sender: userLoggedIn.userName,
            receiver: admin.userName,
            content: state.privateChatMessage
        };


        stompClient.send("/app/privateChat", {}, JSON.stringify(message));

        const newMessages = [...privateMessages];
        newMessages.push(message);
        setPrivateChatMessages(newMessages);

    };

    const onMessageReceived = (payload) => {

        getGroupMessages(token).then((msg) => {
            const newMessages = [...groupMessages]
            msg.forEach((m) => newMessages.push(m))
            setGroupMessages(newMessages);
        }
        )
        loadContacts()

    }

    const onError = (error) => {
        setState({
            error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
        })
    }
    //---------------------------------------------
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




    const handleSendMessage = () => {


        var chatMessage = {
            sender: userLoggedIn.userName,
            content: state.chatMessage,
            type: "CHAT"

        };

        // send public message
        stompClient.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
        const newMessages = [...groupMessages];
        newMessages.push(chatMessage);
        setGroupMessages(newMessages);
        setState({
            ...state,
            chatMessage: ''
        })
    }

    const openAdminPanel = () => {
        document.querySelector(".admin-chatbox").style.display = "block"
        document.querySelector(".groupMsg").style.zIndex="-1"
    }


    return (
        <div>
            {isUserAuthenticated ?
                (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-6">

                                {
                                    state.channelConnected ?
                                        <div className="groupMsg">
                                            <div id="frame">

                                                <ScrollToBottom className="messages">
                                                    <ul>
                                                        {groupMessages.map((msg) => (
                                                            <li key={msg.id || (Math.random() * 20 + new Date())}
                                                                className={msg.sender === userLoggedIn.userName ? "sent" : "replies"}>
                                                                {msg.sender !== userLoggedIn.userName && (
                                                                    <div style={{ display: "flex", flexDirection: "column-reverse", float: "right" }}>
                                                                        <small >{msg.sender}</small>  <img src={userImage} alt="" className="img-circle" style={{ width: "12%", height: "12%" }} /></div>
                                                                )}
                                                                <p>{msg.type === "CHAT" ? <span>{msg.content}</span> : <span>{msg.type === "JOIN" ? <span>{msg.sender === userLoggedIn.userName ? <span>You joined</span> : <span>{msg.sender} joined</span>}</span> : <span>{(msg.type === "LEAVE" && msg.sender !== userLoggedIn.userName) ? <span>{msg.sender} left</span> : <span>You left</span>}</span>}</span>}<br /><small style={{ float: "right" }}>{msg.createdAt ? formatAMPM(new Date(msg.createdAt)) : formatAMPM(new Date())}</small></p>

                                                            </li>
                                                        ))}
                                                    </ul>

                                                </ScrollToBottom>

                                                < div className="message-input">
                                                    <div className="wrap">
                                                        <span style={{ display: "flex", flexDirection: "row" }}>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="publicChatMessageInput"
                                                                name="chatMessage"
                                                                value={state.chatMessage}
                                                                onChange={handleTyping}
                                                                placeholder="Type message here"
                                                                onKeyPress={event => {
                                                                    if (event.key === "Enter") {
                                                                        handleSendMessage()
                                                                    }
                                                                }}
                                                            /><Button
                                                                id="sendGrpMsg"
                                                                onClick={() => {
                                                                    handleSendMessage();

                                                                }}
                                                            >Send<FaPaperPlane size={17} /></Button>
                                                        </span>
                                                        <button onClick={disconnect}>Disconnect</button>

                                                    </div>

                                                </div>


                                            </div>


                                        </div> : (<div><strong>Get Connected. Enquire infomration about me from your friends. </strong><hr /><span><strong>{onlineUsers} Of your friends are online</strong><button onClick={connectToServer}>Connect</button></span></div>)
                                }

                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-4" >
                                <div className="admin-chatbox" >
                                    <div id="user-frame">
                                        <strong>{admin && <span>A chat history with {admin.userName}</span>}</strong>
                                        <ScrollToBottom className="messages">
                                            <ul>
                                                {privateMessages.map((msg) => (
                                                    <li key={msg.id || (Math.random() * 20 + new Date())}
                                                        className={msg.senderId === userLoggedIn.uid ? "sent" : "replies"}>
                                                        {msg.senderId !== userLoggedIn.uid && (
                                                            <img src={userImage} alt="" className="img-circle" style={{ width: "6%", height: "6%" }} />
                                                        )}
                                                        <p>{msg.content}<br /><small style={{ float: "right" }}>{msg.createdAt ? formatAMPM(new Date(msg.createdAt)) : formatAMPM(new Date())}</small></p>
                                                    </li>
                                                ))}
                                            </ul>

                                        </ScrollToBottom>
                                        <div className="message-input">
                                            <div className="wrap">
                                                <span>
                                                    <input
                                                        name="privateChatMessage"
                                                        id="privateChatMessageInput"
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
                                                        className="sendprivateSmsBtn"

                                                        onClick={() => {
                                                            sendPrivateMessage();
                                                            setState({ ...state, privateChatMessage: '' })
                                                        }}
                                                    >Send<FaPaperPlane size={17} /></Button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="open-admin-icon">

                            {state.channelConnected && <span> 
                               
                            <Button type="primary" onClick={openAdminPanel} shape="circle" icon={<FaEnvelope size={40}/>} className="mail-icon"/>
                               </span>}

                        </div>
                    </div>


                ) : (
                    <Link to="/login"> Go to login page</Link>

                )
            }
        </div >
    )


}

