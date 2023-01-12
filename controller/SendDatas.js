const db=require('../database/db.js')
const express =require('express')



const createTable=()=>{
    try{
         // const data= await"mukesh";
         db.execute('CREATE TABLE disposecall (id  INT  AUTO_INCREMENT PRIMARY KEY,  cdrid VARCHAR(255),agent_talktime_sec INT,start_stamp DATETIME);')
         .then(()=>{
            console.log("table created");
            // return res.status(200).json({result});
         }).catch(err=>console.log(err));
    }catch(error){
        return res.status(500).json({msg:"Error while sending data to database"})
    }
}

const insertData=()=>{
    try{
         // const data= await"mukesh";
         db.execute("INSERT INTO disposecall (id,cdrid, agent_talktime_sec,start_stamp) VALUES ('1', '1b66674a-471b-4ff4-b9b6-e3dd5ad0233bd','16','2023-01-10 14:36:44'),('5488' , '1b66674a-471b-4ff4-b9b6-e3dd5ad0233b','15','2023-01-10 14:36:43');")
         .then(()=>{
            console.log("data inserted");
            // return res.status(200).json({result});
         }).catch(err=>console.log(err));
    }catch(error){
        return res.status(500).json({msg:"Error while sending data to database"})
    }
}

const getAllData=async(req,res)=>{
    try{
        const data=await db.execute("SELECT * FROM disposecall")
                console.log(data)
                return data;
        // .then((result)=>{
        //     console.log("data fetched");
        //     var data=result[0][0].cdrid;
        //         console.log(data)
        //      return data 
        //     //  res.status(200).json(data[0][0].cdrid);
        //  }).catch(err=>console.log(err));
    }catch(error){
        return res.status(500).json({msg:"Error while sending data to database"})
    }
    }



module.exports={insertData,getAllData,createTable}
