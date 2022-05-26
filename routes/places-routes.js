const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
const placesControllers = require("../controllers/places-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

// GET IMAGE FOR PLACE FROM AWS S3
router.get("/images/:key", placesControllers.downloadFromAwsS3)

router.use(checkAuth);

// CREATE
router.post(
  "/",
  fileUpload.single("image"),
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  check("address").not().isEmpty(),
  placesControllers.createPlace
);

// UPDATE
router.patch(
  "/:pid",
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  placesControllers.updatePlace
);

// DELETE
router.delete("/:pid", placesControllers.deletePlace);



module.exports = router;
