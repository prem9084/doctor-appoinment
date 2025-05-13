import jwt from "jsonwebtoken";

// admin authentication middleware

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: "User not authorized" });
    }

    const tokenDecode = jwt.verify(dtoken, process.env.JWT);
    req.docId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
