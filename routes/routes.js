const express=require('express');
const{ insertData,getAllData,createTable}=require("../controller/SendDatas.js")

const router=express.Router();


router.post('/sendData',createTable);
router.post('/insertData',insertData);
router.get('/getAllData',getAllData);
module.exports=router;