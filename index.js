const express = require('express')
const fs = require('fs')
const {MongoClient} =  require('mongodb')

const app = express();
const POST = 5000;
let DB = '';

const client = new MongoClient('mongodb+srv://admin:25Kfu3VbD4nnOut4@cluster0.oogmr.mongodb.net/iptv?retryWrites=true&w=majority')

 async function connectMongoDB (collection = 'tv'){
    try {
        await client.connect()
        console.log('Good connect mongoDB')
        DB = await client.db('iptv').collection(collection).find().toArray();

    }catch (e){
        console.log(e)
    }
 }


app.get('/',(req,res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);

    connectMongoDB()

    res.send(DB)
})

app.get('/file/iptv.m3u',(req,res) => {

    connectMongoDB('tv_m3u')

    let valueFile = '';

    async function recordFile (){
          valueFile += '#EXTM3U max-conn="2" url-tvg="https://antifriztv.com/xmltv.xml.gz"\n'

          await  DB.forEach(item => {
                valueFile += '\n'
                valueFile += '#EXTINF:0,' + item['name'] + '\n';
                valueFile += '#EXTGRP:' + item['groupTV'] + '\n';
                valueFile += item['url'] + '\n';
            })

          await  fs.writeFileSync('iptv.m3u',valueFile)
    }


    recordFile()

    res.header("Content-Disposition: attachment; filename=iptv.m3u");
    res.download('iptv.m3u')
})

app.listen(POST,() => console.log('Serve start ' + POST))