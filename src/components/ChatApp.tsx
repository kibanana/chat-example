import React from 'react';
import socket from '../lib/socket';
import ChatForm from './ChatForm';

interface State {
    logs: any[];
}

interface message {
    id: string
    name: string
    message: string
}

class ChatApp extends React.Component {
    state: State;

    constructor (props: Readonly<{}>) {
        super(props);
        this.state = { logs: [] };
    }

    componentDidMount() {
        socket.on('receive-msg', (params: message = { id: '', name: '', message: '' }) => {
            const { id, name, message } = params;            
            const { logs: tempLog } = this.state;
            tempLog.unshift({
                id,
                key: `${tempLog.length + 1}`,
                name,
                message,
            });
            this.setState({ logs: tempLog });
        });
    }

    render() {
        const { logs } = this.state;
        const messages = logs.map(message => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            <div key={message.key}>
                <span>{message.name}</span>
                <span>{message.message}</span>
            </div>
        });
        
        return (
            <div>
                <ChatForm />
                <div>{messages}</div>
            </div>
        );
    }
}

export default ChatApp;