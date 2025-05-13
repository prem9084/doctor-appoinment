import jwt from "jsonwebtoken";

// admin authentication middleware

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "User not authorized" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT);
    req.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
