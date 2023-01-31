const jwt = require("jsonwebtoken");
module.exports = function(req,res,next){
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({message: "Access denied"});
    try{
        token = token.replace("Bearer ", "");
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = verified;
        next();
    }catch (e){
        return res.status(401).json({message: "Access denied"});
    }
}