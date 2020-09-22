import React from 'react';
import socket from '../lib/socket';
import ChatForm from './ChatForm';

interface message {
    id: string
    name: string
    message: string
}

interface cnt {
    name: string
    cnt: number
}

interface State {
    logs: any[]
    name: string
    cnt: number | null
}

class ChatApp extends React.Component<{}, State> {
    constructor (props: Readonly<{}>) {
        super(props);
        this.state = { logs: [], name: '', cnt: null };
    }

    componentDidMount() {
        socket.on('receive-name', (params: cnt = { name: '', cnt: -1 }) => {
            const { name, cnt } = params;
            this.setState({ name, cnt });
        });

        socket.on('receive-msg', (params: message = { id: '', name: '', message: '' }) => {
            const { id, name, message } = params;            
            const { logs } = this.state;
            const tempLog = logs;
            tempLog.unshift({
                id,
                key: `${tempLog.length + 1}`,
                name,
                message,
            });
            this.setState({ logs: tempLog });
        });
    }

    handleChangeName = (name: string) => {
        this.setState({ name });
        socket.emit('update-name', { name });
    }

    handleSendMessage = (message: string) => {
        const { name } = this.state;
        socket.emit('send-msg', { name, message });
    }

    render() {
        const { logs, name } = this.state;
        const messages = logs.map(message => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            <div style={{background: 'blue'}} key={message.key}>
                <span>{message.name}</span>
                <span>{message.message}</span>
            </div>
        });
        
        return (
            <div>
                <ChatForm
                    name={name}
                    handleChangeName={this.handleChangeName}
                    handleSendMessage={this.handleSendMessage}
                />
                <div>{messages}</div>
            </div>
        );
    }
}

export default ChatApp;