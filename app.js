const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");

const app = express();
const jsonParser = express.json();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

const userScheme = new Schema({ name: String, age: Number }, { varionKey: false });
const User = mongoose.model('User', userScheme);
/* создаю подключение к базе данных,
интерестно, как это происходит на реальном сервере.
 */


// создаем доступ к статическим файлам
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true }, err => {
    if (err) return console.log(err);
    app.listen(3000, () => {
        console.log('Сервер ожидает ответа...');
    });
});



// обработали 
app.get('/api/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return console.log(err);
        res.send(users);
    }).sort({ _id: -1 });
});


app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    User.findOne({ _id: id }, (err, user) => {
        if (err) return console.log(err);
        res.send(user);
    });
});


// app.use(bodyParser());

// add user
app.post('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const userName = req.body.name;
    const userAge = req.body.age;

    let user = new User({ name: userName, age: userAge });

    user.save((err) => {
        if (err) return console.log(err);
        res.send(user)
    });
});


app.put('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newUser = { age: userAge, name: userName };

    User.findByIdAndUpdate({ _id: id }, newUser, { new: true }, (err, user) => {
        if (err) return console.log(err);
        res.send(user);
    });
});


app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, user) => {
        if (err) return console.log(err);
        res.send(user);
    });
});