import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    // take the sessionid from cookies
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({ message: "Unauthorized user" });
    }
    // if session id recived TouchEvent,
    const session = await redis.get(`session-${sessionId}`);
    if (!session) {
      return res.status(400).json({ message: "Session expired" });
    }

    req.user = JSON.parse(session);
    next();
  } catch (error) {
    res.status(500).json({ message: `Middleware error-->${error}` });
  }
};


export default protect;