const fs = require('fs');
//add server network
const http = require('http');
const url = require('url');

/** FILE */

//Block, synchronous way
// const text_input = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(text_input);
//
// const text_output = `This is what we know about the avocado: ${text_input}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',text_output);
// console.log('File has been written');

//const text_input_2 = fs.readFileSync('./txt/output.txt','utf-8');
//console.log(text_input_2);

//Non-blocking asynchronous way
// fs.readFile('./txt/start.txt','utf-8', (err,data1) => {
//     if(err) return console.log("ERROR");
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8', (err,data3) => {
//             console.log(data3);
//
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8',err =>{
//                 console.log('Your file has been written');
//             })
//         });
//     });
// });
// console.log('Will read file');

/** SERVER */
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%PRODUNUTRIENTSCTNAME%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic');
    }
    return output;
}
const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const temp_product = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const product_data = JSON.parse(data);



const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    /** Overview page */
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const cards_html = product_data.map(el => replaceTemplate(temp_card,el)).join('');
        const output = temp_overview.replace('{%PRODUCT_CARDS%}', cards_html);
        res.end(output);

    /** product page */
    }else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product_id = product_data[query.id];
        const product_name = product_data[query.productName];
        console.log(pathname);
        console.log(query);

        const output = replaceTemplate(temp_product, product_id);
        res.end(output);

    /** API */
    }else if (pathname === '/api') {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
    /** page not found */
    }else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(3000, '127.0.0.1', () =>{
    console.log('Listening to requests on port 8000');
});