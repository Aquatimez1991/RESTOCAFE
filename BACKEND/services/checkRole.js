require("dotenv").config();

function checkRole(req, res, next) {

  if (res.locals.role === "user") { 
    return res.sendStatus(401); 
  }
  next();
}

module.exports = { checkRole:checkRole };
