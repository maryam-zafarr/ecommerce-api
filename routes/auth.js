const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Register
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

// Login
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        const { password, ...others } = user._doc;

        return res.json({ token, ...others });
      });
    } catch (error) {
      return next();
    }
  })(req, res, next);
});

module.exports = router;
