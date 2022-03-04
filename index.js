const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const newsPapers = [
    {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: ""
    },
    {
        name: "gaurdian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk/"
    }
];

const articles = [];

newsPapers.forEach(newsPaper => {
    axios.get(newsPaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html)
   
    $('a:contains("climate")', html).each(function (){
        const title = $(this).text();
        const url = $(this).attr('href');
               articles.push({
                   title,
                   url: newsPaper.base + url,
                   sourse : newsPaper.name
               })
    })
})

})

app.get('/', (req, res)=> {
    res.json("welcome to my api")
})

app.get('/news',(req, res)=> {
    res.json(articles);
 })

 app.get('/news/:newspaperId', (req, res) => {
     const newspaperId = req.params.newspaperId;
     const newsPaperAddress = newsPapers.filter(newsPaper => 
         newsPaper.name === newspaperId)[0].address;

        const newsPaperBase = newsPapers.filter(n => n.name === newspaperId)[0].base;
        
         axios.get(newsPaperAddress).then((response) => {
         const html = response.data;
         const $ = cheerio.load(html)
         const specificItems = [];
    
     $('a:contains("climate")', html).each(function (){
         const title = $(this).text();
         const url = $(this).attr('href');
         specificItems
         .push({
             title,
             url: newsPaperBase + url,
             sourse: newspaperId
         })
     })
     res.json(specificItems)
    }).catch((err => console.log(err)))

 })





app.listen(PORT, () => console.log("server is runnning"))