import React from 'react';
import { Button, TextField, Card, CardContent } from '@material-ui/core';
import ForumIcon from '@material-ui/icons/Forum';
import SaveIcon from '@material-ui/icons/Save';

interface State {
    tempName: string;
    readOnlyName: boolean;
    message: string;
    cnt: number;
}

interface Props {
    name: string
    handleChangeName: Function
    handleSendMessage: Function
}

class ChatForm extends React.Component<Readonly<Props>, State> {
    constructor (props: Readonly<Props>) {
        super(props);
        this.state = { tempName: '', readOnlyName: true, message: '', cnt: -1 };
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => this.setState({ ...this.state, [e.target.name]: e.target.value })

    handleChangeNameReadOnly = (e: any) => this.setState((state) => ({ readOnlyName: !state.readOnlyName }))

    render() {
        const { handleChangeName, handleSendMessage } = this.props;
        const { tempName, readOnlyName, message } = this.state;

        return (
            <Card>
                <CardContent>
                    <form>
                        <TextField
                            type="text"
                            name="tempName"
                            label="이름"
                            value={readOnlyName ? this.props.name : tempName}
                            disabled={readOnlyName}
                            onChange={this.handleChange}
                            onDoubleClick={this.handleChangeNameReadOnly}
                            onBlur={this.handleChangeNameReadOnly}
                            autoComplete="off"
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large" 
                            onClick={() => tempName && handleChangeName(tempName)}
                            startIcon={<SaveIcon />}>
                            이름 변경
                        </Button>

                        <br />

                        <TextField
                            type="text"
                            label="메시지"
                            name="message"
                            value={message}
                            onChange={this.handleChange}
                            autoComplete="off"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => {
                                if (!message) return;
                                handleSendMessage(message);
                                this.setState({ message: '' });
                            }}
                            startIcon={<ForumIcon />}>
                            보내기
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }
}

export default ChatForm;