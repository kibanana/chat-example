import React, { ChangeEvent } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, BottomNavigation, BottomNavigationAction, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import EmojiPeopleRoundedIcon from '@material-ui/icons/EmojiPeopleRounded';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import socket from '../lib/socket';
import ChatForm from './ChatForm';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    menu: string
    room: string | null
    showSuccessSnackbar: boolean
    showFailureSnackbar: boolean
}

class ChatApp extends React.Component<{}, State> {
    constructor (props: Readonly<{}>) {
        super(props);
        this.state = {
            logs: [],
            name: '',
            cnt: null,
            room: null,
            menu: 'room',
            showSuccessSnackbar: false,
            showFailureSnackbar: false,
        };
    }

    componentDidMount() {
        socket.on('connected', (params: any) => {
            this.setState({ showSuccessSnackbar: true });
            setTimeout(() => this.setState({ showSuccessSnackbar: false }), 1000)
        });

        socket.on('disconnected', (params: any) => {
            this.setState({ showFailureSnackbar: true });
            setTimeout(() => this.setState({ showFailureSnackbar: false }), 1000)
        });

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
        });

        socket.on('receive-msg-in-room', (params: message = { name: '', message: '' }) => {
            // TODO: 방 내에 받은 메시지 띄우기
        });

        socket.on('disconnect', () => {
            // TODO: 방 밖으로 이동
        });
    }

    handleMenuChange = (e: ChangeEvent<{}>, value: any) => this.setState({ ...this.state, menu: value })

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

    handleSuccessSnackbarClose = () => this.setState({ showSuccessSnackbar: false })
    handleFailureSnackbarClose = () => this.setState({ showFailureSnackbar: false })

    render() {
        const { logs, name, room, menu, showSuccessSnackbar, showFailureSnackbar } = this.state;
        const messages = logs.map((message: message) => (
            <TableRow key={message.key}>
                <TableCell align="right">{message.name || '*공지*'}</TableCell>
                <TableCell align="right">{message.message}</TableCell>
            </TableRow>
        ));
        
        return (
            <Container maxWidth="sm">
                <Snackbar open={showSuccessSnackbar} autoHideDuration={6000} onClose={this.handleSuccessSnackbarClose}>
                    <Alert onClose={this.handleSuccessSnackbarClose} severity="success">
                        This is a connected event!
                    </Alert>
                </Snackbar>
                <Snackbar open={showFailureSnackbar} autoHideDuration={6000} onClose={this.handleFailureSnackbarClose}>
                    <Alert onClose={this.handleFailureSnackbarClose} severity="error">
                        This is a disconnected event!
                    </Alert>
                </Snackbar>
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
                <BottomNavigation value={menu} onChange={this.handleMenuChange}>
                    <BottomNavigationAction label="Friend" value="friend" icon={<EmojiPeopleRoundedIcon />} />
                    <BottomNavigationAction label="Room" value="room" icon={<MeetingRoomIcon />} />
                    <BottomNavigationAction label="Setting" value="setting" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Container>
        );
    }
}

export default ChatApp;