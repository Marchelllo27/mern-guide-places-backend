const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
const usersControllers = require("../controllers/user-controllers");

const router = express.Router();
//all routes start with /api/users/

//GET ALL USERS
router.get("/", usersControllers.getUsers);

// SIGN UP
router.post(
  "/signup",
  fileUpload.single("image"),
  check("name").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 5 }),
  usersControllers.signup
);

// LOGIN
router.post("/login", usersControllers.login);

// GET AVATAR IMAGE FROM AWS S3

router.get("/images/:key", usersControllers.downloadFromAwsS3);

module.exports = router;
