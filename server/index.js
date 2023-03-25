const express = require("express");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const User = require("./src/v1/models/user");
const JWT = require("jsonwebtoken");
const app = express();
const PORT = 5000;
require("dotenv").config();

// データベースに接続
try {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("データベースに接続しました");
}
catch (error) {
    console.log(error);
}

// ユーザー新規登録API
app.post("/registar", async (req, res) => {
    //パスワードの受け取り
    const password  = req.body.password;

    try {
        // パスワードのハッシュ化
        req.body.password  = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
        // ユーザーの新規作成
        const user = await User.create(req.body);
        // JWTトークンの生成
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "1d",
        });
        // レスポンス
        return res.status(200).json({ user, token });
    }
    catch (error) {
        // エラーのレスポンス
        return res.status(500).json(error);
    }
});

app.listen(PORT, () => {
    console.log("ローカルサーバー起動中・・・");
});