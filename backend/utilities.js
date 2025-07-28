const jwt = require('jsonwebtoken'); // ✅ correct spelling

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // ✅ correct header key
  const token = authHeader && authHeader.split(" ")[1]; // ✅ get token after "Bearer"

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401); // Forbidden if token is invalid

    req.user = user; 
    next();
  });
}

module.exports = {
  authenticationToken,
};
