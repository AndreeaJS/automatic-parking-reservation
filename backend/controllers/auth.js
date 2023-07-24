import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // verifica user ca exista
    const q = "SELECT * FROM users WHERE emailUser = ? OR usernameUser = ?"
    db.query(q, [req.body.emailUser, req.body.usernameUser], (err,data) => {
        if (err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("Utilizatorul deja există!");
 
        // Hash pentru parola si creare user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.passwordUser, salt);

        const q = "INSERT INTO users(`usernameUser`,`userType`, `emailUser`,`passwordUser`) VALUES (?)"
        const values = [
            req.body.usernameUser,
            req.body.userType,
            req.body.emailUser,
            hash,
        ];
        db.query(q, [values], (err,data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Utilizatorul a fost creat !");
        });
    });
}

export const login = (req, res) => {
    // Verifica daca userul exista
    const q = "SELECT * FROM users WHERE emailUser = ?";

    db.query(q, [req.body.emailUser], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("Utilizatorul nu a fost găsit!");

        //Verifica parola
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.passwordUser, 
            data[0].passwordUser); // true
        // data[0] este primul utilizator => parola lui

        if(!isPasswordCorrect) 
            return res.status(400).json("Parolă greșită!");

        const token = jwt.sign({ idUser: data[0].idUser }, "jwtkey");
        const { passwordUser, ...other } = data[0];
        res
        .cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json(other);
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    })
    .status(200)
    .json("Utilizatorul a fost deconectat cu su")
};