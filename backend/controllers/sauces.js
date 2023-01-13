const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = async (req, res, next) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      likes: 0,
      dislikes: 0,
    });
    await sauce.save();
    res.status(201).json({ message: "Sauce enregistrée !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneSauce = async (req, res, next) => {
  try {
    const findOne = await Sauce.findOne({
      _id: req.params.id,
    });
    res.status(200).json(findOne);
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

exports.getAllSauce = async (req, res, next) => {
  try {
    const sauces = await Sauce.find({});
    res.status(200).json(sauces);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

exports.likeDislikeSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() =>
          res.status(200).json({ message: "Vous avez liké la sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else if (
      req.body.like === -1 &&
      !sauce.usersDisliked.includes(req.body.userId)
    ) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
        .then(() =>
          res.status(200).json({ message: "Vous avez disliké la sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() =>
            res.status(200).json({ message: "Vous avez disliké la sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res.status(200).json({ message: "Vous avez disliké la sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });
};
