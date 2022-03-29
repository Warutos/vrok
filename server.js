const express = require('express');
const app = express();
const APIKEY = 'a739ecf8-5d6c-443a-9ab9-1e730582aaa3';
//const bodyParser = require('body-parser');
app.use(express.json());
app.post('/login',(req,res) => {
    let username = req.body.username;
    res.send("Username is" + username);
});
app.get('/history',(req,res) => {
    res.send("GET History 111");
});
const port = process.env.PORT || 3131;
app.listen(port,() => console.log(`Listening on port ${port}.....`));