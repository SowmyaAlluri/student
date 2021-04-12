const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');

const app = express();


const couch = new NodeCouchDb({
    auth: {
        user: 'admin',
        password: 'admin'
    }
})

const dbName = 'demo_db';
const viewUrl = '_design/StudentInfo/_view/TestView?include_docs=true'

const getUrl = '_design/studentCity/_view/City?key="deo"'





couch.listDatabases().then((dbs) => {
    console.log(dbs);
})



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))


//list of all documents
app.get('/', (req, res) => {
    // res.render('index');
    couch.get(dbName, viewUrl).then(
        (data, headers, status) => {
            res.json(data);
        }
    )
});


const mangoQuery = {
    selector: {
        // "lname": {
        //     "$eq": "kim"
        // }
        "$or": [
            {
                "lname": {
                    "$eq": "kim"
                }
            },
            {
                "age": {
                    "$eq": 15
                }
            }
        ]
    }

};

const parameters = {};
app.get('/queryOr', (req, res) => {
    couch.mango(dbName, mangoQuery, parameters).then(
        (data, headers, status) => {
            res.json(data);

        })


});


const query = {
    selector: {
        "lname": {
            "$eq": "kim"
        }
        

    }

};

const parameter = {};
app.get('/queryEq', (req, res) => {
    couch.mango(dbName, query, parameter).then(
        (data, headers, status) => {
            res.json(data);

        })


});

//get element by id
app.get('/id', (req, res) => {
    // res.render('index');
    couch.get(dbName, getUrl).then(
        (data, headers, status) => {
            res.json(data);
        }
    )
});


//post data
app.post("/",  (req, res) => {
    couch
        .insert(dbName, {
            _id: req.body.id,
            fname: req.body.fname,
            lname: req.body.lname,
            age: req.body.age,
            hobbies: req.body.hobbies,
            city: req.body.city,


        })
        .then( (data, headers, status) => {
            res.send(data.data);
      

});
});

//delete by id

app.delete("/delete",  (req, res) => {
    let _rev;
    couch.get(dbName, req.query.id).then(
      (data) => {
        _rev = data.data._rev;
        couch.del(dbName, req.query.id, _rev).then(
          ({ data, headers, status }) => {
            res.send(data);
          }
        );
      },
    );
  });

app.listen(3000, () => {
    console.log('server started');
});