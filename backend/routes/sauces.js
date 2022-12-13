const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const stuffCtrl = require("../controllers/sauces");

router.get("/", auth, stuffCtrl.getAllSauce);
router.post("/", auth, multer, stuffCtrl.createSauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.put("/:id", auth, stuffCtrl.modifySauce);
router.delete("/:id", auth, stuffCtrl.deleteSauce);

module.exports = router;
