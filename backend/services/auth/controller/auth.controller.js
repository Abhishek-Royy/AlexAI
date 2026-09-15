import { app } from "../config/fireBase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

// create LOGIN API
export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decode = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({
      fireBaseUID: decode.uid,
    });

    // condition to check user exist or not
    if (!user) {
      user = await User.create({
        fireBaseUID: decode.uid,
        name: decode.name,
        email: decode.email,
        avatar: decode.picture,
      });
    }

    // generate a session id
    const sessionId = crypto.randomUUID();

    // Redis
    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      4 * 24 * 60 * 60,
    ); //Expire after 7 din

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000, //how much time it will be valid
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: `Login eroor....${error}` });
  }
};

// create LOGOUT API
export const logOut = async (req, res) => {
  try {
    const sessionId =
      req.cookies?.session ||
      req.headers.cookie?.match(/session=([^;]+)/)?.[1];

    // remove session from redis
    if (sessionId) {
      await redis.del(`session-${sessionId}`);
    }

    // remove session from cookies
    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(400).json({ message: `Logout eroor....${error}` });
  }
};
