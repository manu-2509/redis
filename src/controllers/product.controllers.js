const express = require('express');

const Product = require('../models/product.models')

const client = require('../configs/redis')

const router = express.Router();



router.post('',async(req, res)=>{
    try {
        const product = await Product.create(req.body);
    
        const products = await Product.find().lean().exec();
        
        client.set('products',JSON.stringify(products));
    
        return res.status(201).send(product)
    } catch (err) {
        return res.status(500).send({err: err.message});
    }
})



router.get('',async(req, res)=>{
try {
    
        client.get('products',async function(err,fetchedProducts){
         
                if(fetchedProducts){
                    return res.status(200).send(products)
                }else{
      
                    try {
                        const products = await Product.find().lean().exec()
                
                        client.set('products',JSON.stringify(products))
                
                        return res.status(200).send({products})
                    } catch (err) {
                        return res.status(500).send({err: err.message});
                    }
                }  
            })  
} catch (err) {
    return res.status(500).send({err: err.message});
}
})


router.get("/:id", async (req, res) => {
    try {
      client.get(`products.${req.params.id}`, async function (err, fetchedProduct) {
        if (fetchedProduct) {
          const product = JSON.parse(fetchedProduct);
  
          return res.status(200).send(product);
        } else {
          try {
            const product= await Product.findById(req.params.id).lean().exec();
  
            client.set(`products.${req.params.id}`, JSON.stringify(product));
  
            return res.status(200).send(product);
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
  
      const products = await Product.find().lean().exec();
  
      client.set(`products.${req.params.id}`, JSON.stringify(product));
      client.set("products", JSON.stringify(products));
  
      return res.status(200).send(product);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  

  router.delete("/:id", async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
  
      const products = await Product.find().lean().exec();
  
      client.del(`products.${req.params.id}`);
      client.set("products", JSON.stringify(products));
  
      return res.status(200).send(product);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  

  module.exports = router;