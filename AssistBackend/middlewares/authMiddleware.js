// authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
	const authHeader = req.header("Authorization");
	if (!authHeader) return res.status(401).json({ message: "NO Auth!!!" });
	const token = authHeader.split(" ")[1];
	if (!token) return res.status(401).json({ message: "NO TOKEN!!!" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: err.message });
	}
};
