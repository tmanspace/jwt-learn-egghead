const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8888

const jwtCheck = expressJwt({
    secret: 'mysupersecretkey',
    algorithms: ["HS256"]
})

const users = [
    {id: 1, username: 'admin', password: 'admin'},
    {id: 2, username: 'guest', password: 'guest'}
]

app.use(bodyParser.json())
app.use(cors())

app.get('/status', (req, res) => {
    const localTime = (new Date()).toLocaleTimeString()

    res
    .status(200)
    .send(`Server time is ${localTime}.`)
})

app.get('/resource', (req, res) => {
    res
    .status(200)
    .send('Public resoure, u can see this')
})

app.get('/resource/secret', jwtCheck, (req, res) => {
    res
    .status(200)
    .send('Secret resoure, u can see this if u logged in')
})


app.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res
        .status(400)
        .send('You need a username and password!')
        return  
    }

    const user = users.find((u) => {
        return u.username === req.body.username && u.password === req.body.password
    })

    if (!user) {
        res
        .status(401)
        .send('User wasn\'t found')
        return        
    }

    const token = jwt.sign({
        sub: user.id,
        username: user.username
    }, 'mysupersecretkey', {algorithm: "HS256" ,expiresIn: "3 hours",})

    res
    .status(200)
    .send({access_token: token});
})

app.get('*', (req, res) => {
    res.sendStatus(404)
})

app.listen(port, () => {
    console.log(`Port started on ${port}`)
})