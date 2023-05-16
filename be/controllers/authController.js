const { db } = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const express = require("express")
const app = express()
app.set("view engine", "ejs")

// Import the email template file
const fs = require("fs")
const path = require("path")
const emailTemplatePath = path.join(__dirname, "email-verification.html");
const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
// const emailTemplate = fs.readFileSync("./email-verification.html", "utf8")


// set up nodemailer ##
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ihzasukarya@gmail.com",
        pass: "bejjhsfacfwufhnd"
    }
})



module.exports = {
    register: (req, res) => {
        const q = `SELECT * FROM users where username = ?`
        db.query(q, [req.body.username], (err, data) => {
            if (err) return res.status(500).json(err)
            if (data.length) return res.status(400).json({ msg: "User already exists!" })

            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({ msg: "Passwords do not match!" })
            }

            // Password validation
            const passwordRequirements = [
                {
                    regex: /(?=.*\d)/,
                    message: "Password should contain at least one digit.",
                },
                {
                    regex: /(?=.*[a-z])/,
                    message: "Password should contain at least one lowercase letter.",
                },
                {
                    regex: /(?=.*[A-Z])/,
                    message: "Password should contain at least one uppercase letter.",
                },
                {
                    regex: /^[0-9a-zA-Z]{8,}$/,
                    message: "Password should contain at least 8 characters.",
                },
            ];

            for (const requirement of passwordRequirements) {
                if (!requirement.regex.test(req.body.password)) {
                    return res.status(400).json({ msg: requirement.message });
                }
            }

            // Email validation
            const emailRegex = /^\S+@\S+\.\S+$/
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).json({ msg: "Invalid email format." })
            }

            // Hash pass
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)

            // create user
            const q = "INSERT INTO users (`username`, `email`, `password`, `status`, `verification_token`) VALUES (?, ?, ?, ?, ?)"

            const token_verification = jwt.sign({ email: req.body.email }, "JWT")

            const values = [req.body.username, req.body.email, hashedPassword, "unverified", token_verification]
            db.query(q, values, (err, data) => {
                if (err) return res.status(500).json(err)


                const verificationLink = `http://${req.headers.host}/auth/verify-email/${token_verification}`
                const emailContent = emailTemplate.replace("{{verificationLink}}", verificationLink)

                const mailOptions = {
                    from: "verify your email",
                    to: req.body.email,
                    subject: ' "Email Verification" <ihzasukarya@gmail.com>',
                    html: emailContent
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json(error)
                    } else {
                        console.log("Email sent: " + info.response)
                        return res.status(200).json({ msg: "User has been created. Please check your email to verify your account." })
                    }
                })
            })
        })
    },

    resendVerification: (req, res) => {

        const verificationToken = req.params.token;

        jwt.verify(verificationToken, 'JWT', (err, decoded) => {
            if (err) return res.status(400).json({ msg: 'Invalid verification token.' });

            const newVerificationToken = jwt.sign({ email: decoded.email }, 'JWT');

            const verificationLink = `http://${req.headers.host}/auth/verify-email/${newVerificationToken}`;
            const emailContent = emailTemplate.replace('{{verificationLink}}', verificationLink);

            const insertQuery = "UPDATE users SET verification_token = ?"
            const values = [newVerificationToken];

            console.log(decoded.email);

            db.query(insertQuery, values, (err, data) => {
                const mailOptions = {
                    from: 'verify your email',
                    to: decoded.email,
                    subject: 'Email Verification <ihzasukarya@gmail.com>',
                    html: emailContent,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({ data, msg: 'Please check your email to verify your account.' });
                    }
                });
            });
        })
    },

    verifyEmail: (req, res) => {
        const verificationToken = req.params.token
        jwt.verify(verificationToken, "JWT", (err, decoded) => {
            if (err) return res.status(400).json({ msg: "Invalid verification token." })

            const selectQuery = "SELECT * FROM users WHERE email = ? AND verification_token = ? AND status = 'unverified'"
            db.query(selectQuery, [decoded.email, verificationToken], (err, data) => {
                if (err) return res.status(500).json(err)
                if (data.length === 0) return res.status(400).json({ msg: "Invalid verification token." })

                const updateQuery = "UPDATE users SET status = 'verified', verification_token = '' WHERE email = ?"
                db.query(updateQuery, [decoded.email], (err, data) => {
                    if (err) return res.status(500).json(err)

                    res.status(200).json({ msg: "Email verification successful." })
                })
            })
        })
    },

    forgotPassword: (req, res) => {
        const { email } = req.body;

        const selectQuery = "SELECT * FROM users WHERE email = ?";
        db.query(selectQuery, [email], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json({ msg: "User does not exist" });

            const token = jwt.sign({ email: data[0].email, id: data[0].id }, "JWT", { expiresIn: '1h' });

            const invalidateQuery = "UPDATE users SET reset_password_token = ? WHERE email = ?";
            db.query(invalidateQuery, [token, email], (err, result) => {
                if (err) return res.status(500).json(err);

                const id = data[0].id;

                const resetLink = `http://${req.headers.host}/auth/reset-password/${id}/${token}`;
                // console.log(data[0].id);

                const mailOptions = {
                    from: "Reset password",
                    to: email,
                    subject: 'Reset Password',
                    html: `<p>Hello,</p><p>You have requested to reset your password. Please click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>If you did not request this, please ignore this email.</p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json(error);
                    } else {
                        console.log("Email sent: " + info.response);
                        return res.status(200).json({ msg: "New password request sent. Please check your email to reset your password." });
                    }
                });
            });
        });
    },

    resetPassword: (req, res) => {
        const { id, token } = req.params;

        try {
            const verify = jwt.verify(token, "JWT");

            const q = "SELECT * FROM users WHERE id = ? AND reset_password_token = ?";
            db.query(q, [id, token], (err, data) => {
                if (err) return res.status(500).json(err);
                if (data.length === 0) {
                    return res.status(404).json({ msg: "Expired link" });
                } else {
                    res.status(200).render("index", { email: verify.email });
                }
            });
        } catch (error) {
            console.log(error);
            res.status(404).json({ msg: "Expired link" });
        }
    },

    resetPasswordTwo: (req, res) => {
        const { id, token } = req.params;
        const { password } = req.body;

        try {
            const verify = jwt.verify(token, "JWT");
            const q = "SELECT * FROM users WHERE id = ?";
            db.query(q, [id], (err, data) => {
                if (err) return res.status(500).json(err);
                if (data.length === 0) {
                    return res.status(404).json({ msg: "User not found!" });
                } else {
                    // Hash pass
                    const encryptedPassword = bcrypt.hashSync(password, 10);
                    const updateQ = "UPDATE users SET password = ?, reset_password_token = NULL WHERE id = ?";
                    db.query(updateQ, [encryptedPassword, id], (err, result) => {
                        if (err) return res.status(500).json(err);
                        return res.status(200).json({ msg: "Update password success" });
                    });
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Failed to update password!" });
        }
    },

    login: (req, res) => {
        const q = "SELECT * FROM users WHERE username = ? OR email = ?"

        db.query(q, [req.body.username, req.body.username], (err, data) => {
            if (err) return res.status(500).json(err)
            if (data.length === 0) return res.status(404).json({ msg: "User not found" })

            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
            if (!checkPassword) return res.status(400).json({ msg: "Wrong password" })

            const token = jwt.sign({ id: data[0].id }, "JWT", { expiresIn: '2h' })

            const { password, ...others } = data[0]

            res.cookie("accessToken", token, {
                httpOnly: true
            }).status(200).json({ others, token })
        })
    },

    logout: (req, res) => {
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
        }).status(200).json({ msg: "User has been logged Out" })
    }
}

