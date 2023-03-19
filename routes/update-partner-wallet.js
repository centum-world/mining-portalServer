const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const cron = require('node-cron');

cron.schedule("* * * * * *",function(){
//     //console.log("node cron job....")
    router.post('/update-partner-wallet-details',(req,res)=>{
        const partnerid = req.body;
        query = "update mining_partner set partner_wallet=? where p_userid = ?";
        connection.query(query,[partnerid.p_userid],(err,results)=>{
            console.log(results);
            if(!err){
                return res.status(200).json({
                    message:"Updated Partner Wallet successfully",
                    data:results,
                    
                });
                //console.log(partner_wallet);
                
            }else{
                return res.status(500).json(err);
            }
        
        });
    });
    
    
})

module.exports = router;