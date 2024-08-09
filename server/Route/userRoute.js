const express = require('express');
// const multer = require('multer');
const router = express.Router();

const userController = require('../controllers/userController');


// image upload
// var storage = multer.diskStorage({
//     destination: function(req, res, cb){
//         cb(null, './uploads');
//     },
//     filename: function(req, file,cb){
//         cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
//     }
// })

// var upload = multer({
//     storage: storage,
// }).single("image");



router.get('/dashboard',userController.dashboardPage);


router.get('/account/:id',userController.accountPage);
router.put('/account/:id',userController.editProfilePage);
router.get('/transactions/:id',userController.transactionPage);

router.get('/trades',userController.tradePage);
router.get('/refer',userController.referPage);
router.get('/premium',userController.premiumPage);

router.get('/deposit', userController.depositPage);
router.get('/depositHistory/:id',userController.depositHistory);

router.get('/withdrawal',userController.widthdrawPage);
router.post('/widthdraw/:id',userController.widthdrawPage_post);
router.get('/widthdrawHistory/:id',userController.widthdrawHistory);

// router.get('/buyCrypto', userController.buyCrypto)

module.exports = router;

