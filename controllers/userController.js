import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import nodemailer from "nodemailer";

// =======================
// SIGN UP
// =======================
export const signUp = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// SIGN IN
// =======================
export const signIn = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        console.log(req.body)

        // Validate required fields
        if (!email || !password) {
            console.log("user not found")

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            console.log("user not found")

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            console.log("user not found")

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        // Remove password
        const userData = user.toObject();
        delete userData.password;
        console.log(userData)
        return res.status(200).json({

            success: true,
            message: "Sign in successful",
            token,
            user: userData
        });

    } catch (error) {
        console.error("Sign in error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Generate 5-digit OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString();

        // SMTP transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Your App" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 10 minutes.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp,
        });

    } catch (error) {
        console.error("OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};
