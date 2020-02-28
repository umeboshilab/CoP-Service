import React, { Component, useCallback } from 'react';
import autoBind from 'react-autobind';
import './EditNewArticle.css';
import { withRouter } from 'react-router';
import PageHeader from './PageHeader';
import marked from 'marked';
// import sanitize from 'sanitize-html';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';

class EditNewArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            article_title: "",
            article_tags: "",
            alert: "",
            files: [],
        }
        autoBind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        marked.setOptions({ breaks: true });
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeTags = this.handleChangeTags.bind(this);
        this.handleChageSubmit = this.handleChangeSubmit.bind(this);
        // this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleOnDrop = (files) => { // なんでコンストラクタで書くかわからん．active
            this.setState({ files })
            files.map(file => console.log(file.name))
        };
    }

    // handleOnDrop(event) {
    //     event.map(file => {
    //         this.setState({ files: file.name });
    //         console.log(file.name);
    //     });
    // }


    handleChangeText(event) {
        this.setState({ text: event.target.value });
        console.log(event.target.value);
    }
    handleChangeTitle(event) {
        this.setState({ article_title: event.target.value });
    }
    handleChangeTags(event) {
        this.setState({ article_tags: event.target.value });
    }

    handleChangeSubmit(e) {
        // this.setState({ alert: "ボタンが押されました" })
        if (this.state.article_title !== "" && this.state.text !== "") {
            var time = new Date();
            var date = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            var date2 = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getHours() + "-" + time.getMinutes() + "-" + time.getSeconds();
            let new_article = {
                article_title: this.state.article_title,
                article_date: date,
                article_date2: date2,
                article_text: this.state.text,
                // filenameに関してはexpress側で実装する
                article_tag_id: 1, //あとで追加するんやでな
                write_user_id: 1 //あとで実装するんやでな
            };

            // fetch("http://172.20.11.121:3000/article/create", {
            fetch("http://localhost:1234/article/create", {
                // fetch("http://192.168.0.13:4000/article/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(new_article)
            });
            this.props.history.push('/');
        } else {
            this.setState({ alert: "情報が入力されていません" })
        }
    }




    render() {
        const files = this.state.files.map(file => (
            <div>
                <li key={file.name}>
                    {file.name} - {file.size} bytes  -  {file.path}
                </li>
                <img style={{ width: '4vw', height: '4vw' }} src={file.path} alt="img" />
            </div>
        ));

        return (
            <div>
                <PageHeader />
                <div className="EditNewArticle">

                    {/* タイトルやタグを記入する部分 */}
                    <div className="EditNewArticleHeader">
                        <div className="EditNewArticleHeaderTitle">
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Title"
                                value={this.state.query}
                                onChange={(event) => this.handleChangeTitle(event)}
                            />
                        </div>
                        {/* ドロップダウンから選択する方法にする．というかあとで実装する */}
                        <div className="EditNewArticleHeaderTag">
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Tags   デザインは後で 画像sanitize-html" value={this.state.query}
                                onChange={(event) => this.handleChangeTags(event)} />
                        </div>
                    </div>

                    {/* メインの文章を記入する部分 */}
                    <div className="EditNewArticleBody">

                        {/* 文章の太字や画像の設定をする場所． 後で実装する */}
                        {/* <div className="EditNewArticleBodyOption"></div> */}
                        {/* https://github.com/apostrophecms/sanitize-html */}


                        <div className="EditNewArticleBodyEditor">
                            <Dropzone onDrop={this.handleOnDrop}
                                accept="image/gif,image/jpeg,image/png,image/jpg">
                                {({ getRootProps, getInputProps }) => (
                                    <section className="uploadContainer">
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {
                                                <div>Drop 'n' drop some files here, or click to select files</div>
                                            }
                                        </div>
                                        <aside>
                                            ここにファイル名が出力されるはずだよ
                                            <ul>{files}</ul>
                                        </aside>
                                    </section>
                                )}
                            </Dropzone>
                            <TextField
                                fullWidth
                                multiline
                                rows="15"
                                size="small"
                                variant="outlined"
                                placeholder="記事をMarkDown形式で入力"
                                value={this.state.text}
                                onChange={this.handleChangeText}
                            />
                        </div>
                        <div className="EditNewArticleBodyPreview">
                            <div dangerouslySetInnerHTML={{ __html: marked(this.state.text) }}>
                            </div>
                        </div>
                    </div>
                    {/* <p>{this.state.alert}</p> */}
                    <div className="EditNewArticleFooter">
                        <Button color="primary" onClick={this.handleChangeSubmit}>投稿する</Button>
                    </div>
                </div>
            </div >
        );
    }
}

export default withRouter(EditNewArticle);
