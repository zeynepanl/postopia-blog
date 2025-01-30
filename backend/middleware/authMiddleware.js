const jwt = require("jsonwebtoken");

module.exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Unauthorized - No Token" });

  try {
    // "Bearer " varsa kaldır
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

//Yeni: Admin kontrolü
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Admin yetkili, devam edebilir
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Admin privileges required." });
  }
};
