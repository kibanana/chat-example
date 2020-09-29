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
    room: string | null
}

class ChatApp extends React.Component<{}, State> {
    constructor (props: Readonly<{}>) {
        super(props);
        this.state = {
            logs: [],
            name: '',
            cnt: null,
            room: null,
            value: 'recents',
        };
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

        // Random chat room
        socket.on('req-join-room-accepted', (params: any) => {
            // TODO: 방으로 들어가기
        })

        socket.on('receive-msg-in-room', (params: message = { name: '', message: '' }) => {
            // TODO: 방 내에 받은 메시지 띄우기
        });

        socket.on('disconnect', () => {
            // TODO: 방 밖으로 이동
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

    // TODO: 랜덤방 요청 시 이벤트 핸들러 socket.emit('req-join-room');
    handleRequestRandomRoom = () => {

    }

    // TODO: (기다리는 상태에서) 랜덤요청 취소 시 이벤트 핸들러 socket.emit('req-join-room-canceled')
    handleCancelRequestRandomRoom = () => {
        
    }

    // TODO: 랜덤방 내에서 메시지 전송 시 이벤트 핸들러 socket.emit('send-msg-in-room')
    handleSendMessageInRoom = (message: string) => {

    }

    render() {
        const { logs, name, room, value } = this.state;
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
                    room={room}
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