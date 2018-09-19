const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, "../public");
const port = process.env.POST || 3000;

var app = express();

app.use(express.static(publicPath));

app.listen(port ,()=>{
    console.log(`Server runing on port ${port}`);
})

//finish module 106 in 09 Real time ....., stopped at 14.11
