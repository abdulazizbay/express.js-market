const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Cart = require('../models/Cart')
const Product = require('../models/product')
router.post('/addtocart',async(req,res)=>{
    try{
        const {userID, products} = req.body
        for (const { productID, qty } of products) {
            const user = await User.findById(userID)
            if(!user){return res.status(400).json({message: 'User not Found'})}
            const product = await Product.findById(productID)
            if(!product){return res.status(400).json({message: 'Product not Found'})}
            const bill = product.price * qty
            if(!bill){return res.status(400).json({message: 'something went wrong with the bill'})}
            const cart = await Cart.findOne({user:userID})
            if(!cart){
                const newCart = new Cart({user:userID,product:productID, qty:qty, bill:bill})
                await newCart.save()
                res.status(200).json({message:"success",cart:newCart})
            }else {
                const existingProduct = cart.products.find((item) => item.product.equals(productID));

                if (existingProduct) {
                  existingProduct.qty += qty;
                  existingProduct.bill += bill;
                } else {
                  cart.products.push({ product: productID, qty: qty, bill: bill });
                }
              }
        
              await cart.save();
              console.log(cart);
            console.log(cart);
            res.status(200).json({message:"success", added:cart})
        }

    }catch(err){
      res.status(400).json({message: err.message})
    }
})

router.post('/delete', async (req, res) => {
  try {
    const { userID, products } = req.body;
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (const { productID, qty, bill } of products) {
      const deleteProduct = await Cart.findOne({
        user: userID,
        'products.product': productID,
        'products.qty': qty,
        'products.bill': bill
      });

      if (!deleteProduct) {
        return res.status(404).json({ message: 'Product not found in the cart' });
      }

      const productIndex = deleteProduct.products.findIndex(
        (item) =>
          item.product.toString() === productID &&
          item.qty === qty &&
          item.bill === bill
      );
      if (productIndex !== -1) {
        deleteProduct.products.splice(productIndex, 1);
        await deleteProduct.save();
      }
    }

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});





module.exports = router
