const  ELASTIC_SEARCH_URL='https://slashadmin:FlawedByDesign@1612$@elastic-50-uat.slashrtc.in/elastic' ;
const express=require('express');
const elasticsearch = require('elasticsearch');
const{ getAllData}=require("./controller/SendDatas")
const mysql = require('mysql2');
const data=require('./routes/routes.js');
// const client = require('./server/elasticSearch/client.js');

// const {conn}=require('./connection.js')
// const { Client } = require('elasticsearch')


// const db=require('./database/db.js')


// const client = require('./server/elasticSearch/client.js');

const app=express();




const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'sqltoelastic'
});



app.use(data)


var id;
const fetch = async()=>{
  var sqld=await getAllData();
  id=sqld[0][1].cdrid
  console.log("sqld", id)
}

fetch()
console.log("iddddd",id);

app.listen(8000,console.log("server connected successfully"))



///elastic connection
const connect = async () => {
 client = new elasticsearch.Client({
    host: ELASTIC_SEARCH_URL,
    log: { type: 'stdio', levels: [] }
  });
  return client;
};



const ping = async () => {
  let attempts = 0;
  const pinger = ({ resolve, reject }) => {
    attempts += 1;
    client
      .ping({ requestTimeout: 30000 })
      .then(() => {
        console.log('Elasticsearch server available');
        resolve(true);
      })
      .catch(() => {
        if (attempts > 100) reject(new Error('Elasticsearch failed to ping'));
        console.log('Waiting for elasticsearch server...');
        setTimeout(() => {
          pinger({ resolve, reject });
        }, 1000);
      });
  };

  return new Promise((resolve, reject) => {
    pinger({ resolve, reject });
  });
};

const connections=async()=>{
  try{
    await connect();
    await ping();
  }catch(error){
    console.log(error)
  }
}

connections()


//elastic search query
async function run() {
    console.log("id after run", id)
    const response = await client.search({
      index: 'elasticdeliveries',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "callInfo.agentLegUuid.keyword":id,
                }
              }
            ]
          }
        }
      }
    })

    console.log("respone-->",response.hits.hits)
}

//stream
const stream = connection.query(
  'SELECT * FROM disposecall'
).stream();

stream.on('data',async(d) => {
   updateElastic(d)
  console.log(d);
});

stream.on('end', () => {
  // All rows have been received
  connection.end();
});


//updating elastic 
const updateElastic = async(d)=>{
  const  update = {
    script: {
      source: 
             `ctx._source.callInfo.callTime.talkTime = ${d.agent_talktime_sec}`,
            
    },
    query: {
      bool: {
        must: {
          match: {
            "callInfo.agentLegUuid.keyword":`${d.cdrid}`,
          },
        },
      },
    },
  };
  client
    .updateByQuery({
      index: "elasticdeliveries",
      body: update,
    })
    .then(
      (res) => {
        console.log("Success", res);
      },
      (err) => {
        console.log("Error", err);
      }
    );
}



// :'26fe698a-c50d-4543-ae27-a20c45a46919'
setTimeout(()=> {
  console.log("id-->", id)
  run(id).catch(console.log);
}, 3000)





