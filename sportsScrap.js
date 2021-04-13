const request = require('request');
const cheerio = require('cheerio');
const insertIntoDb = require('./connect');



const processArray = async(finalArray) => {
    for(let i=0; i<finalArray.length; i++) {
        let url = finalArray[i];
        console.log(i,'checkedzero')
        await getContentFromLink(url);
        console.log(i,'checked one')
    }
}




// // getinng content from the links and store into mongo db

const getContentFromLink = (link) => {
    return new Promise((resolve,reject) => {
        request(link,async(error,
        response,html)=>{
            if (!error && response.statusCode == 200){
                
                const page = html;
                const $ = cheerio.load(html);

                const headLineData = $('._23498');
                var headLine = headLineData.text();
                // console.log (headLine);

                const headLineContent = $('.ga-headlines');
                var content = headLineContent.text();
                // console.log (content);


                const image = $('._2gIK-').find('img').attr('src');
                // console.log (image);

                let myObj = {'headLine':headLine,'image': image, 'content':content}

                let res = await insertIntoDb("sports",myObj) ;
                resolve(res)
            }else {
                reject(error)
            }
        });
    })
}


// getting array of artcle links/sublinks

request("https://timesofindia.indiatimes.com/sports",(error,
response,html)=>{
    if (!error && response.statusCode == 200){
        
        const $ = cheerio.load(html);
        var linksArray = [];

        $('.w_tle a').each ((i,el)=>{
            const item = $(el).text();
            const link = $(el).attr('href');

            linksArray.push(link);

        }
        );

        var i ,len = linksArray.length ; 
        const finalArray = [];
        for (i = 0; i < len; i++) {
            if (linksArray[i].substring(0, 5) == '/spor'){
                var newLink = "https://timesofindia.indiatimes.com".concat(linksArray[i])
                finalArray.push(newLink);

            }else if (linksArray[i].substring(0, 5) !== '/spor'){
                continue; 

            }
            else {
                finalArray.push(linksArray[i]);
            }
          }
          console.log(finalArray.length);
        processArray(finalArray)
    }
});
