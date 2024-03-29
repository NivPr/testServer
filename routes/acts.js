const express = require("express");
const { add_fav, add_act, getByTime, callculate_profits, getByRange3, post_comment, post_barcode, delete_barcode } = require("../controller/actsC");
const { auth } = require("../middlewares/auth");
const { valueByTime, valueByMonth, valueByDay, getH_L, getByRange, getByRange2 } = require("../services/serv");
const router = express.Router();

router.patch("/favs", auth, add_fav);
router.post("/doAct", auth, add_act);
router.get("/getByTime", getByTime);
router.get('/cal', auth, callculate_profits);
router.get('/range', getByRange3);
router.post('/post_barcode',auth ,post_barcode);
router.delete('/delete_barcode',auth ,delete_barcode);



module.exports = router;