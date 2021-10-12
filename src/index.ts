require('dotenv').config();
const axios = require('axios').default;

axios.post('https://euapi.gizwits.com/app/login', {
    username: process.env.HEATZY_USERNAME,
    password: process.env.HEATZY_PASSWORD
    }, {
    headers: {
        'X-Gizwits-Application-Id': 'c70a66ff039d41b4a220e198b0fcc8b3'
    },
    })
    .then(function (response: any) {
        console.log(response.data);
    })
    .catch(function (error: any) {
        console.log(error);
    });
