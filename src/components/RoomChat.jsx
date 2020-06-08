import React from 'react';
import io from 'socket.io-client'
import '../App.css';

class RoomChat extends React.Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            socket: null,
            messages: [],
            message: "",
            name: "",
            isName: false,
            users: [],
            typing: ""
        };

        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleMessages = this.handleMessages.bind(this);
        this.handleReceivingMessage = this.handleReceivingMessage.bind(this);
        this.handleAddUser = this.handleAddUser.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
    }

    handleMessage = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    handleSendMessage = (e) => {
        e.preventDefault();
        var payload = {
            message: this.state.message,
            from: {
                name: this.state.name
            }
        };

        this.state.socket.emit("send-message", payload);

        this.setState({
            message: ''
        });
    }

    handleReceivingMessage = (payload) => {
        const messages = this.state.messages;
        messages.push(payload);

        this.setState({
            messages: messages
        });
    };

    handleAddUser = (e) => {
        e.preventDefault();

        if (this.state.name) {
            this.setState((state, props) => ({
                isName: !state.isName
            }));
        }

        const socket = io('https://web-socket-io-server.herokuapp.com');

        this.setState({
            socket: socket
        });

        socket.emit("add-user", {
            name: this.state.name
        });

        socket.on("connected", (message) => {
            this.handleReceivingMessage(message);
        });

        socket.on("receive-message", (message) => {
            this.handleReceivingMessage(message);
        });

        socket.on("typing", (payload) => {
            this.setState({
                typing: payload
            });
        });

        socket.on("stop-typing", () => {
            this.setState({
                typing: ''
            });
        });

        socket.on("disconnected", (message) => {
            this.handleReceivingMessage(message);
        });

        socket.on("visitors", (users) => {
            this.setState({
                users: users
            });
        });
    }


    handleTyping = () => {
        clearTimeout(this.timer);

        this.state.socket.emit("typing", {
            from: {
                name: this.state.name
            }
        });

        this.timer = setTimeout(() => {
            this.state.socket.emit("stop-typing")
        }, 2000);
    }

    handleName = (e) => {

        this.setState({
            name: e.target.value
        });
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    handleMessages = () => {

        const { messages } = this.state;
        return messages.map((m, index) => {

            if (m.from) {

                return (
                    <li key={index}>
                        <span style={{ color: 'grey' }}>
                            {m.from.name}
                        </span>
                        <span>
                            : {m.message}
                        </span>
                    </li>
                );
            }
            else {
                return (
                    <li key={index}>
                        <span></span>
                        <span>
                            {m.message}
                        </span>
                    </li>
                );
            }
        });
    }


    renderOnlineVisitorBody() {
        const { users } = this.state;

        return users.map((u, index) => {
            return (
                <li key={index}>{u.name}</li>
            );
        });
    }

    renderTyping = () => {
        
        const { typing } = this.state;

        if (typing) {
            return <p>{typing.message}</p>
        }
    }

    renderBody = () => {

        const { isName } = this.state;

        if (isName) {
            return (
                <>
                    <div>
                        {this.renderTyping()}
                    </div>

                    <div className="float-container">

                        <div className="float-child">
                            <form onSubmit={this.handleSendMessage}>
                                <input type="text" name="msg" id="msg" value={this.state.message} onChange={this.handleMessage} onKeyPress={this.handleTyping} placeholder="Enter message" />
                                <button disabled={!this.state.message} >Send Message</button>
                            </form>
                        </div>

                        <div className="float-child">
                            <ul >
                                {this.renderOnlineVisitorBody()}
                            </ul>
                        </div>

                    </div>

                </>
            );
        }
        else {
            return (
                <>
                    <form onSubmit={this.handleAddUser}>
                        <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleName} placeholder="Enter name" />
                        <button disabled={!this.state.name}>Submit</button>
                    </form>
                </>
            );
        }
    }

    render() {

        return (
            <>
                <div>
                    <h2>Room Chat</h2>
                </div>

                <div>
                    {this.renderBody()}
                </div>

                <ul>
                    {this.handleMessages()}
                </ul>
            </>
        );
    }
}

export default RoomChat;