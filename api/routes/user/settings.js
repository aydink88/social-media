const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { isAuth } = require("../../middlewares/auth");
const Jimp = require("jimp");
const multer = require("multer");
const path = require("path");
const shortId = require("shortid");
const asyncUtil = require("../../middlewares/asyncUtil");
const AppError = require("../../models/AppError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "../public/images/avatars"));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.username}.png`);
  },
});

const upload = multer({ storage: storage });

const togglePrivacy = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).exec();
  user.openProfile = !user.openProfile;
  const updatedUser = await user.save();
  return res.status(200).send({
    code: 200,
    message: "Privacy updated",
    response: updatedUser,
  });
};

const updateDescription = async (req, res) => {
  const { _id } = req.user;
  const { description } = req.body;

  if (description.length > 150) {
    throw new AppError("Your description can't be longer than 150 characters", 400);
  }
  let updatedUser = await User.findByIdAndUpdate(
    _id,
    { description: description },
    { new: true, useFindAndModify: false }
  );
  updatedUser = updatedUser.toObject();
  return res.status(200).json({
    code: 200,
    message: "Description updated!",
    response: {
      newDescription: updatedUser.description,
      updatedUser,
    },
  });
};

const setProfilePicture = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) res.status(500).json({ code: 500, response: "There were an error" });

  const { x, y, width, height } = JSON.parse(req.body.crop);

  const imageToCrop = await Jimp.read(path.resolve(req.file.destination, req.file.filename));
  imageToCrop
    .crop(x, y, width, height)
    .resize(150, 150)
    .quality(100)
    .write(path.resolve(req.file.destination, req.file.filename));
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { profilePic: `/images/avatars/${req.file.filename}` },
    { new: true, useFindAndModify: false }
  );
  return res.status(200).json({
    code: 200,
    response: {
      message: "Foto cambiada con exito",
      path: `${updatedUser.profilePic}?hash=${shortId.generate()}`,
      updatedUser,
    },
  });
};

router.patch("/privacy", isAuth, asyncUtil(togglePrivacy));
router.patch("/description", isAuth, asyncUtil(updateDescription));
router.patch("/profilePicture", [isAuth, upload.single("newImage")], asyncUtil(setProfilePicture));

module.exports = router;
