var express = require('express');
var router = express.Router();
const { cartController } = require('../controllers');

//CART
router.post('/getlistcart', cartController.getListCart);

router.post('/addcart', cartController.addCart);

router.put('/editcart/:id', cartController.editCart);

router.delete('/deletecart/:id', cartController.deleteCart);

router.get('/leftincart', cartController.leftInCart);

router.post('/cartcount', cartController.cartCount);

module.exports = router;