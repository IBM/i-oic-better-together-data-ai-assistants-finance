
import express from "express";
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { requireAuth } from '../middleware/auth.js'
import db from "../db/connection.js";
const router = express.Router();
// This help convert the id from string to ObjectId for the _id.
import  { ObjectId } from "mongodb";

// Sign up
router.post('/signup', async (req, res) => {
  try {

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    // Validate input
    if (!username || !email || !password) {
      res.statusMessage = 'Username, email and password are required' ;
      res.status(400).end();
      return
    }

    let userCollection = await db.collection("user");
    let query = { username: username };
    let existingUser = await userCollection.findOne(query);

    if (existingUser) {
      res.statusMessage = 'Username already registered';
      res.status(400).end();
      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const role = (username === "admin") ? "admin" : "user";

    let newUser = {
      username: username,
      password: passwordHash,
      email: email,
      role: role,
    };

    let createdUser = await userCollection.insertOne(newUser);
    createdUser = await userCollection.findOne({_id: createdUser.insertedId});

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    let userSessioncollection = await db.collection("usersession");

    let usersessionObj = {
      token: token,
      userId: createdUser._id.toString(),
      username: createdUser.username,
      expiresAt: expiresAt,
    };

    let createdUserSession = await userSessioncollection.insertOne(usersessionObj);

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    res.send({
      id: createdUser._id.toString(),
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
    })
  } catch (err) {
    console.error('Sign up error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const username = req.body.auth.username;
    const password = req.body.auth.password;

    // Validate input
    if (!username || !password) {
      res.statusMessage = 'Username and password are required';
      res.status(400).json({ error: 'Username and password are required' })
      return
    }

    let userCollection = await db.collection("user");
    let query = { username: username };

    // Find user
    const user = await userCollection.findOne(query);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.statusMessage = 'Invalid credentials';
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    let userSessioncollection = await db.collection("usersession");

    let usersessionObj = {
      token: token,
      userId: user._id.toString(),
      expiresAt: expiresAt,
    };

    await userSessioncollection.insertOne(usersessionObj);

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    res.json({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    })
  } catch (err) {
    console.error('Sign in error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const token = req.cookies.session
    if (token) {
      const query = { token: token };
      const collection = db.collection("usersession");
      await collection.deleteOne(query);
      res.clearCookie('session')
    }
    res.json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Signout error:', error)
    res.status(500).json({ error: 'Failed to sign out' })
  }
})

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.session
    if (!token) {
      res.json({ user: null })
      return
    }

    let userSessionCollection = await db.collection("usersession");
    let query = { token: token };

    // Find user
    const session = await userSessionCollection.findOne(query);

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie('session')
      res.json({ user: null })
      return
    }

    // get the user object 
    let userCollection = await db.collection("user");
    const userQuery = { _id: new ObjectId(session.userId ) };
    const user = await userCollection.findOne(userQuery);

    if (!user) {
      res.clearCookie('session')
      res.json({ user: null })
      return
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Failed to get current user' })
  }
})

export default router
