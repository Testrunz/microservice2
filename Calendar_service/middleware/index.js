const CalendarUser = require("../models/User");

async function isAuthenticatedCalendar(req, res, next) {
    try {
      let firebaseUser;
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
      }
      if (!firebaseUser) return res.sendStatus(401);
      const user = await CalendarUser.findOne({
        email: firebaseUser.email,
      });
      const { email, userId, name, role } = user;
      if (!user) {
        return res.sendStatus(401);
      }
      req.user = { email, userId, name, role };
      next();
    } catch (err) {
      res.sendStatus(401);
    }
  }

  module.exports={
    isAuthenticatedCalendar
  }