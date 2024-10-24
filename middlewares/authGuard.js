const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(" ")[1];
    console.log("token", token);
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.status(403).send("Forbidden!");
    }

    const { id, username } = decodedToken;
    req.id = id;
    req.username = username;
    next();
  } catch (err) {
    console.log(err.message);

    next({ message: "Authorization failed!" });
  }
};

module.exports = authGuard;
