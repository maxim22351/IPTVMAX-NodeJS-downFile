const express = require('express')
const mysql = require('mysql')
const fs = require('fs')

const app = express();
const POST = 5000;
let DB = '';



 async function connectMysql(hostDB = 'localhost',userDB = 'root',nameDB = 'iptvmax',passwordDB = 'root'){
     const connect = mysql.createConnection({
         host:hostDB,
         user:userDB,
         database:nameDB,
         password:passwordDB
     })


    await connect.connect(err => {console.log(err)})
    await connect.query('SELECT * FROM iptv',(err,result) => {DB = result})
    await connect.end(err => {console.log(err)})

 }



app.get('/',(req,res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);

    connectMysql();
    res.send(DB)
})

app.get('/file/iptv.m3u',(req,res) => {


    // res.send('file create')

    connectMysql();

    let valueFile = '';

    valueFile += '#EXTM3U max-conn="2" url-tvg="https://antifriztv.com/xmltv.xml.gz"\n'

    for (let i = 0; i < DB.length; i++) {
        valueFile += '\n'
        valueFile += '#EXTINF:0,' + DB[i]['name'] + '\n';
        valueFile += '#EXTGRP:' + DB[i]['groupTV'] + '\n';
        valueFile += DB[i]['url'] + '\n';
    }

    // fs.appendFileSync('iptv.m3u',valueFile)

    fs.writeFileSync('iptv.m3u',valueFile)

    res.header("Content-Disposition: attachment; filename=iptv.m3u");
    res.download('iptv.m3u')
})

app.listen(POST,() => console.log('Serve start ' + POST))