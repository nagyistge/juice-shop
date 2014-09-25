/*jslint node: true */

var frisby = require('frisby'),
    passwordHash = require('password-hash');

var URL = 'http://localhost:3000/api';

/* General REST API Test */
frisby.create('GET all models declared in API')
    .get(URL)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data.*', {
        name: String,
        tableName: String
    })
    .expectJSON('data.?', {
        name: 'User',
        tableName: 'Users'
    })
    .expectJSON('data.?', {
        name: 'Feedback',
        tableName: 'Feedbacks'
    })
    .expectJSON('data.?', {
        name: 'Basket',
        tableName: 'Baskets'
    })
    .expectJSON('data.?', {
        name: 'BasketItems',
        tableName: 'BasketItems'
    })
    .expectJSON('data.?', {
        name: 'Product',
        tableName: 'Products'
    }).toss();

/* User Tests */
frisby.create('GET all users')
    .get(URL + '/Users')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data.*', {
        id: Number,
        email: String,
        admin: Boolean,
        password: String,
        createdAt: String,
        updatedAt: String
    }).toss();

frisby.create('POST new user')
    .post(URL + '/Users', {
        email: 'horst@horstma.nn',
        admin: false,
        password: passwordHash.generate('hooooorst')
    })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data', {
        id: Number,
        createdAt: String,
        updatedAt: String
    }).afterJSON(function (user) {
        frisby.create('GET existing user by id')
            .get(URL + '/Users/' + user.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSONTypes('data', {
                id: Number,
                email: String,
                admin: Boolean,
                password: String,
                createdAt: String,
                updatedAt: String
            })
            .expectJSON('data', {
                id: user.data.id
            }).toss();
        frisby.create('PUT update existing user')
            .put(URL + '/Users/' + user.data.id, {
                admin: true
            })
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON('data', {
                admin: true
            }).toss();
        frisby.create('DELETE existing user')
            .delete(URL + '/Users/' + user.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json').toss();
        frisby.create('GET non-existing user by id')
            .get(URL + '/Users/' + user.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON('data', {})
            .toss();
    })
    .toss();

/* Product Tests */
frisby.create('GET all products')
    .get(URL + '/Products')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data.*', {
        id: Number,
        name: String,
        description: String,
        price: Number
    }).toss();

frisby.create('POST new product')
    .post(URL + '/Products', {
        name: 'Raspberry Juice (1000ml)',
        description: "Made from blended Raspberry Pi, water and sugar.",
        price: 4.99
    })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data', {
        id: Number,
        createdAt: String,
        updatedAt: String
    }).afterJSON(function (product) {
        frisby.create('GET existing user by id')
            .get(URL + '/Products/' + product.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSONTypes('data', {
                id: Number,
                name: String,
                description: String,
                price: Number,
                createdAt: String,
                updatedAt: String
            })
            .expectJSON('data', {
                id: product.data.id
            }).toss();
        frisby.create('PUT update existing product')
            .put(URL + '/Products/' + product.data.id, {
                description: "Made from blended raspberries, water and sugar."
            })
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON('data', {
                description: "Made from blended raspberries, water and sugar."
            }).toss();
        frisby.create('DELETE existing product')
            .delete(URL + '/Products/' + product.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json').toss();
        frisby.create('GET non-existing product by id')
            .get(URL + '/Products/' + product.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON('data', {})
            .toss();
    })
    .toss();