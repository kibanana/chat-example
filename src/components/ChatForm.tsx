import React from 'react';
import socket from '../lib/socket';

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
            <div>
                <form>
                    <input
                        type="text"
                        name="tempName"
                        readOnly={readOnlyName}
                        value={readOnlyName ? this.props.name : tempName}
                        onChange={this.handleChange}
                        onDoubleClick={this.handleChangeNameReadOnly}
                    />
                    <button type="button" onClick={() => handleChangeName(tempName)}>이름 변경</button>
                    <br />
                    <input type="text" name="message" value={message} onChange={this.handleChange}/>
                    <button type="button" onClick={() => { handleSendMessage(message); this.setState({ message: '' }); }}>보내기</button>
                </form>
            </div>
        );
    }
}

export default ChatForm;