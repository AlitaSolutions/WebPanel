const jwt = require("jsonwebtoken");
module.exports = function(req,res,next){
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({message: "Access denied"});
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = verified;
        next();
    }catch (e){
        return res.status(401).json({message: "Access denied"});
    }
}