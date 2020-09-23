import React, { ChangeEvent } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import socket from '../lib/socket';
import ChatForm from './ChatForm';

interface message {
    key?: string
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
    value: string
}

class ChatApp extends React.Component<{}, State> {
    constructor (props: Readonly<{}>) {
        super(props);
        this.state = { logs: [], name: '', cnt: null, value: 'recents' };
    }

    componentDidMount() {
        socket.on('receive-name', (params: cnt = { name: '', cnt: -1 }) => {
            const { name, cnt } = params;
            this.setState({ name, cnt });
        });

        socket.on('receive-msg', (params: message = { name: '', message: '' }) => {
            const { name, message } = params;            
            const { logs } = this.state;
            const tempLog = logs;
            tempLog.unshift({
                key: `${tempLog.length + 1}`,
                name,
                message,
            });
            this.setState({ logs: tempLog });
        });
    }

    handleChange = (e: ChangeEvent<{}>, value: any) => this.setState({ ...this.state, value })

    handleChangeName = (name: string) => {
        this.setState({ name });
        socket.emit('update-name', { name });
    }

    handleSendMessage = (message: string) => {
        const { name } = this.state;
        socket.emit('send-msg', { name, message });
    }

    render() {
        const { logs, name, value } = this.state;
        const messages = logs.map((message: message) => (
            <TableRow key={message.key}>
                <TableCell align="right">{message.name || '*공지*'}</TableCell>
                <TableCell align="right">{message.message}</TableCell>
            </TableRow>
        ));
        
        return (
            <Container maxWidth="sm">
                <ChatForm
                    name={name}
                    handleChangeName={this.handleChangeName}
                    handleSendMessage={this.handleSendMessage}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Message</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages}
                        </TableBody>
                    </Table>
                </TableContainer>
                <BottomNavigation value={value} onChange={this.handleChange} style={{width: 500}}>
                    <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
                    <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
                    <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
                    <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
                </BottomNavigation>
            </Container>
        );
    }
}

export default ChatApp;