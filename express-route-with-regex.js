const express = require('express');
const app = express();

app.get("/", function(req, res, next){
    res.send('result from route 1')
});
app.get("/929[/]{0,1}", function(req, res, next){
    res.send('result from route 2')
});
app.get("/929/:chapter(([1-9]|[1-9][0-9]|[1-8][0-9]{2}|9[01][0-9]|92[0-9]))[/]{0,1}", function(req, res, next){
    res.send(`result from route 3 - chapter: ${req.params.chapter}`)
});
app.get("/929/:chapter(([1-9]|[1-9][0-9]|[1-8][0-9]{2}|9[01][0-9]|92[0-9]))/:articleId((\\d+))[/]{0,1}", function(req, res, next){
    res.send(`result from route 4 - chapter: ${req.params.chapter}, articleId: ${req.params.articleId}`)
});

app.listen(9999, function(){
    console.log('We are open for testing express route with Regex!');
});
