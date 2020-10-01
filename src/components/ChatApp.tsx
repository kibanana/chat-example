import React, { ChangeEvent } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    Snackbar,
    Button,
    CircularProgress
} from '@material-ui/core';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import EmojiPeopleRoundedIcon from '@material-ui/icons/EmojiPeopleRounded';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import socket from '../lib/socket';
import Alert from './Alert';
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
    menu: string
    room: boolean
    progressing: boolean
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
            room: false,
            menu: 'room',
            progressing: false,
            showSuccessSnackbar: false,
            showFailureSnackbar: false,
        };
    }

    componentDidMount() {
        socket.on('connected', (params: any) => {
            console.log(socket.connected);
            console.log(socket.disconnected);

            this.setState({ showSuccessSnackbar: true });
            const optional: { logs?: any[] } = {};
            const { logs } = this.state;
            if (logs.length > 1) optional['logs'] = [];
            setTimeout(() => this.setState({ // 서버와 연결이 끊기고 다시 연결됐을 때 connected 이벤트 처리
                cnt: null,
                room: false,
                menu: 'room',
                progressing: false,
                showSuccessSnackbar: false,
                showFailureSnackbar: false,
            }), 1000)
        });

        socket.on('disconnected', (params: any) => {
            this.setState({ showFailureSnackbar: true, room: false });
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
            this.setState({ progressing: false, room: true });
        });
    }

    handleMenuChange = (e: ChangeEvent<{}>, value: any) => this.setState({ ...this.state, menu: value })

    handleChangeName = (name: string) => {
        this.setState({ name });
        socket.emit('update-name', { name });
    }

    handleSendMessage = (message: string) => {
        socket.emit('send-msg', { message });
    }

    handleSendMessageInRoom = (message: string) => {
        socket.emit('send-msg-in-room', { message });
    }

    // TODO: 랜덤방 요청 시 이벤트 핸들러 socket.emit('req-join-room');
    handleRequestRandomRoom = () => {
        socket.emit('req-join-room');
        this.setState({ progressing: true });
    }

    // TODO: (기다리는 상태에서) 랜덤요청 취소 시 이벤트 핸들러 socket.emit('req-join-room-canceled')
    handleCancelRequestRandomRoom = () => {
        socket.emit('req-join-room-canceled');
        this.setState({ progressing: false });
    }

    handleSuccessSnackbarClose = () => this.setState({ showSuccessSnackbar: false })
    handleFailureSnackbarClose = () => this.setState({ showFailureSnackbar: false })

    render() {
        const { logs, name, room, menu, progressing, showSuccessSnackbar, showFailureSnackbar } = this.state;
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

                {
                    room ||
                    (
                        <Button onClick={this.handleRequestRandomRoom} disabled={progressing}>
                            채팅 상대 찾기
                        </Button>
                    )
                }
                
                {
                    progressing &&
                    (
                        <>
                            <CircularProgress />
                            <Button onClick={this.handleCancelRequestRandomRoom}>
                                취소
                            </Button>
                        </>
                    )
                }
                <ChatForm
                    name={name}
                    room={room}
                    handleChangeName={this.handleChangeName}
                    handleSendMessage={room ? this.handleSendMessageInRoom : this.handleSendMessage }
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
                    <BottomNavigationAction label="PlayGround" value="ground" icon={<SettingsInputAntennaIcon />} />
                    <BottomNavigationAction label="Friend" value="friend" icon={<EmojiPeopleRoundedIcon />} />
                    <BottomNavigationAction label="Room" value="room" icon={<MeetingRoomIcon />} />
                    <BottomNavigationAction label="Setting" value="setting" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Container>
        );
    }
}

export default ChatApp;