const express = require('express')
const fs = require('fs')
const {MongoClient} =  require('mongodb')
const url = require('url')
const puppeteer = require('puppeteer')

const app = express();
const POST = 5000;
let DB = '';

// let header = `
//     import React, {FC} from 'react';
//
//     const TVprogram:FC = () => {
//         return (
//
// `
//
// let footer = `
//             );
//     };
//
//     export default TVprogram;
// `

const client = new MongoClient('mongodb+srv://admin:25Kfu3VbD4nnOut4@cluster0.oogmr.mongodb.net/iptv?retryWrites=true&w=majority')

 async function connectMongoDB (collection,group = ''){
    try {
        await client.connect()
        console.log('Good connect mongoDB')
        if (group !== ''){
            DB = await client.db('iptv').collection(collection).find({groupTV:group}).toArray();
        } else {
            DB = await client.db('iptv').collection(collection).find().toArray();
        }


    }catch (e){
        console.log(e)
    }
 }

// async function Parse (){
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto('https://tv.meta.ua/?period=all-day')
//
//     const nameTV = await page.$eval('body > main > div:nth-child(2) > main > div.channel-block__wrapper',(arg) => arg.outerHTML)
//
//
//     await fs.writeFileSync('front-end/src/Components/TVprogram.tsx',header)
//     await fs.appendFileSync('front-end/src/Components/TVprogram.tsx',nameTV)
//     await fs.appendFileSync('front-end/src/Components/TVprogram.tsx',footer)
//     await browser.close()
// }

app.get('/',async (req,res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);


    let urlParser = url.parse(req.url,true)


    if (urlParser.query.group !== ''){
       await connectMongoDB('tv',urlParser.query.group)
    } else {
       await connectMongoDB('tv')
    }

    // await Parse()
    await res.send(DB)

})

app.get('/file/iptv.m3u',async (req,res) => {

    let valueFile = ''

    await connectMongoDB('tv_m3u')

    valueFile += '#EXTM3U max-conn="2" url-tvg="https://antifriztv.com/xmltv.xml.gz"\n'

    await  DB.forEach(item => {
        valueFile += '\n'
        valueFile += '#EXTINF:0,' + item['name'] + '\n';
        valueFile += '#EXTGRP:' + item['groupTV'] + '\n';
        valueFile += item['url'] + '\n';
    })

    await  fs.writeFileSync('iptv.m3u',valueFile)
    await  res.header("Content-Disposition: attachment; filename=iptv.m3u");
    await  res.download('iptv.m3u')

})

app.get('/file', async (req,res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);

    // res.send('<h1>M</h1>')
    res.send(`
        <input type="file" name="f">
        <input type="file" name="f">
        <script>
               fetch('http://localhost:5000/file')
        
        </script>
    `)

    console.log(req)
})



app.listen(POST,() => console.log('Serve start ' + POST))
