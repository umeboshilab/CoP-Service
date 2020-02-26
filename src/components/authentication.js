import React, { Component } from 'react';
import autoBind from 'react-autobind';
import './authentication.css';
import PageHeader from './PageHeader';
import { withCookies, Cookies } from 'react-cookie';
import { HomeFooter } from './Home';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class authentication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // reduxによるデータ保存をしたい．
            user_name: "",
            user_mail: "",
            user_password: "",
            alert: ""
        }
        autoBind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeMail = this.handleChangeMail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    }

    componentWillMount() { // コンポー年とがDOMに追加される前に一度だけ呼ばれる → 初期化処理に適している
        const { cookies } = this.props;
        this.state = {
            user_name: cookies.get("user_name") || "",
            user_password: cookies.get("user_password") || ""
        }
    }

    handleChangeUsername(event) {
        this.setState({ user_name: event.target.value });
    }
    handleChangePassword(event) {
        this.setState({ user_password: event.target.value });
    }
    handleChangeMail(event) {
        this.setState({ user_mail: event.target.value });
    }

    handleSubmit(e) {
        const { cookies } = this.props;
        this.setState({ submit: "True" });
        var user_name = this.state.user_name;

        //ここにログイン情報が正しいかの確認処理を行うPOST
        if (this.state.user_name !== "" && this.state.user_password !== "") {
            let user_info = {
                user_name: this.state.user_name,
                user_password: this.state.user_password,
            };
            // fetch("http://172.20.11.121:3000/user/auth", {
            fetch("http://localhost:1234/user/auth", {
                // fetch("http://192.168.0.13:4000/user/auth", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user_info)
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({ user_hash: json.user_hash })
                    console.log(JSON.stringify(json[0].user_hash));

                    if (json[0].user_hash !== "no") {
                        cookies.set('user_name', user_name, { path: '/' });
                        cookies.set('user_hash', json[0].user_hash, { path: '/' });

                        this.props.history.push('/')
                    } else {
                        this.setState({ alert: "入力情報が正しくありません．" })
                        console.log("入力情報が正しくありません．")
                    }
                });

        } else {
            this.setState({ alert: "情報が入力されていません" })
            console.log("情報が入力されていません")
        }
    }

    handleSigninSubmit(e) {
        const { cookies } = this.props;
        var user_name = this.state.user_name;
        let new_user = {
            user_name: this.state.user_name,
            user_mail: this.state.user_mail,
            user_password: this.state.user_password,
        };
        if (this.state.user_name !== "" && (this.state.user_mail !== "" && this.state.user_password !== "")) {
            // fetch("http://172.20.11.121:3000/user/create", {
            fetch("http://localhost:1234/user/create", {
                // fetch("http://192.168.0.13:4000/user/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(new_user)
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({ user_hash: json[0].user_hash })

                    if (json[0].user_hash !== "no") {
                        cookies.set('user_name', user_name, { path: '/' });
                        cookies.set('user_hash', json[0].user_hash, { path: '/' });

                        this.props.history.push('/')
                    } else {
                        this.setState({ alert: "入力情報が正しくありません．" })
                        console.log("入力情報が正しくありません．")
                    }
                });

        } else {
            this.setState({ alert: "情報が入力されていません" })
            console.log("情報が入力されていません")
        }
    }

    render() {
        return (
            <div>
                <PageHeader />
                <div className="auth">
                    <div className="signin">
                        新規登録
                        <div>
                            <TextField
                                variant="outlined"
                                placeholder="input your user_name"
                                size="small"
                                fullWidth
                                variant="standard"
                                value={this.state.query}
                                onChange={(event) => this.handleChangeUsername(event)}
                            />
                        </div>
                        <div>
                            <TextField
                                variant="outlined"
                                placeholder="input your email"
                                size="small"
                                fullWidth
                                variant="standard"
                                value={this.state.query}
                                onChange={(event) => this.handleChangeMail(event)}
                            />
                        </div>
                        <div>
                            <TextField
                                variant="outlined"
                                placeholder="input your password"
                                size="small"
                                fullWidth
                                variant="standard"
                                type="password"
                                value={this.state.query}
                                onChange={(event) => this.handleChangePassword(event)}
                            />
                        </div>
                        <div>
                            <Button variant="outlined" color="secondary" onClick={this.handleSigninSubmit}>新規登録するで</Button>
                        </div>
                    </div>
                    <div className="signin">
                        ログイン
                        <div>
                            <TextField
                                variant="outlined"
                                placeholder="input your user_name"
                                size="small"
                                fullWidth
                                variant="standard"
                                value={this.state.query}
                                onChange={(event) => this.handleChangeUsername(event)}
                            />
                        </div>
                        <div>
                            <TextField
                                variant="outlined"
                                placeholder="input your password"
                                size="small"
                                fullWidth
                                variant="standard"
                                type="password"
                                value={this.state.query}
                                onChange={(event) => this.handleChangePassword(event)}
                            />
                        </div>
                        <div>
                            <Button size="small" variant="outlined" color="secondary" onClick={this.handleSubmit}>ログインするで</Button>
                        </div>
                        <div className="alert"><p>{this.state.alert} <br /></p></div>
                    </div>
                </div>
                <HomeFooter />
            </div >
        );
    }
}

export default withCookies(authentication);