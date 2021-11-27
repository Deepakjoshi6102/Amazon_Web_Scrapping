
const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.in/New-Apple-iPhone-11-64GB/dp/B08L8C1NJ3/ref=sr_1_1_sspa?dchild=1&keywords=iphone+12&qid=1635070861&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzQVhHREdVOFQySFRCJmVuY3J5cHRlZElkPUEwNTM3NDYxMlFFT1g4U0RYT0VKNiZlbmNyeXB0ZWRBZElkPUEwMDYzODI4S0pKQjhaTFUwVjJHJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==';

async function configureBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page) {
    await page.reload();
    let price = await page.evaluate(
      () => document.getElementById("priceblock_ourprice").innerText
    );
    let currentPrice = parseFloat(price.slice(1).replace(",", ""));
    if(currentPrice < 45000){
    sendNotification(currentPrice);
    } 
  }


  async function startTracking() {
    const page = await configureBrowser();
  
    let job = new CronJob('* */30 * * * *', function() { //runs every 30 minutes in this config
      checkPrice(page);
    }, null, true, null, null, true);
    job.start();
}




async function sendNotification(price) {
    //console.log(price);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testerdeepak1414@gmail.com',
        pass: 'mypass@14'
      }
      
    });
  
    let textToSend = 'Dont wait just grab it asap ' + price;
    let htmlText = `<a href=\"${url}\">Link</a>`;
    
    
    
  
    let info = await transporter.sendMail({
      from: '"Price Tracker" <testerdeepak1414@gmail.com',
      to: "deepakjoshi6104@gmail.com",
      subject: 'Price dropped to ' + " " + price, 
      text: textToSend,
      html: htmlText
    });
  
     console.log("Message sent: %s", info.messageId);
  }
  startTracking();





//   async function monitor(){
//       let page=await configureBrowser();
//       await checkPrice(page);
//   }
//   monitor();

