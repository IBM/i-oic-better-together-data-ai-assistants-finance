
import db from "../db/connection.js";
import  { ObjectId } from "mongodb";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.session

    if (!token) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    let userSessionCollection = await db.collection("usersession");
    let query = { token: token };
    // Find user
    const session = await userSessionCollection.findOne(query);

    if (!session) {
      res.clearCookie('session')
      res.status(401).json({ error: 'Invalid session' })
      return
    }

    if (session.expiresAt < new Date()) {
      await collection.deleteOne(query);
      res.clearCookie('session')
      res.status(401).json({ error: 'Session expired' })
      return
    }

    // get the user object 
    let userCollection = await db.collection("user");
    const userQuery = { _id: new ObjectId(session.userId ) };
    const user = await userCollection.findOne(userQuery);

    req.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    req.session = {
      id: session._id,
      token: session.token
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
