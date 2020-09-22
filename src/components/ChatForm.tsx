import React from 'react';
import socket from '../lib/socket';

interface State {
    name: string;
    message: string;
    cnt: number;
}

interface cnt {
    name: string
    cnt: number
}

class ChatForm extends React.Component {
    state: State;

    constructor (props: Readonly<{}>) {
        super(props);
        this.state = { name: '', message: '', cnt: -1 };
    }

    componentDidMount() {
        socket.on('receive-name', (params: cnt = { name: '', cnt: -1 }) => {
            const { name, cnt } = params;
            this.setState({ name, cnt });
        });
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => this.setState({ [e.target.name]: e.target.value })

    updateName() {
        const { name } = this.state;
        socket.emit('update-name', { name });
    }

    sendMessage() {
        const { name, message } = this.state;
        socket.emit('send-msg', { name, message });
        this.setState({ message: '' });
    }

    render() {
        const { name, message } = this.state;

        return (
            <div>
                <form>
                    <input type="text" name="name" value={name} onChange={this.handleChange}/>
                    <button onClick={this.updateName}>이름 변경</button>
                    <br />
                    <input type="text" name="message" value={message} onChange={this.handleChange}/>
                    <button onClick={this.sendMessage}>보내기</button>
                </form>
            </div>
        );
    }
}

export default ChatForm;