const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const session = require('express-session');
const app = express();

const CLIENT_ID = 'fida.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.use(cors({ origin: 'http://localhost', credentials: true }));
app.use(express.json());
app.use(session({
    secret: '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',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Simulated user database (replace with real database like MongoDB)
const users = [];

app.post('/auth/google', async (req, res) => {
    const { id_token, action } = req.body;

    try {
        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { sub: googleId, name, email } = payload;

        let user = users.find(u => u.googleId === googleId);

        if (action === 'signup') {
            if (user) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }
            user = { googleId, name, email };
            users.push(user);
            req.session.user = user;
            return res.json({ success: true, action: 'Signup', user });
        } else {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found. Please sign up.' });
            }
            req.session.user = user;
            return res.json({ success: true, action: 'Login', user });
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});