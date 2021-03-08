const Express = require('express');
const bodyParser = require('body-parser');

const app = Express();
app.use(bodyParser.json());
const port = 5000;



const users = [
  {
    "id": 1,
    "name": "a"
  },
  {
    "id": 2,
    "name": "b"
  },
  {
    "id": 3,
    "name": "c"
  },
  {
    "id": 4,
    "name": "d"
  },
  {
    "id": 5,
    "name": "e"
  },
  {
    "id": 6,
    "name": "f"
  },
  {
    "id": 7,
    "name": "g"
  },
  {
    "id": 8,
    "name": "h"
  },
  {
    "id": 9,
    "name": "i"
  },
  {
    "id": 10,
    "name": "j"
  },
  {
    "id": 11,
    "name": "k"
  },
  {
    "id": 12,
    "name": "l"
  },
]

const contactBook = []

app.post('/createuser', (req, res) => {
  if (contactBook.find(val => val.email === req.body.email) == undefined) {
    contactBook.push(req.body)
  }
  else {
    res.json({
      "resp":"user exist"
    })
  }
  let resultEmail = contactBook.find(val => val.email === req.body.email);
  console.log(resultEmail)
  res.json({
    "resp":{
      "status":"user created",
      "users":contactBook[contactBook.length-1]
    }
  })
})


app.get('/getusers', (req, res) => {
  let { page = 1, limit = 5 } = req.query;
  page = parseInt(page)
  limit = parseInt(limit)
  let response = paginateMe(page, limit, contactBook)
  res.json(response)
})


const paginateMe = (page, limit, query) => {
  console.log("successfull pagination")
  const startI = (page - 1) * limit;
  const endI = page * limit;

  let response = {}

  if (endI < query.length) {
    response.next = {
      page: page + 1,
      limit
    }
  }
  if (startI > 0) {
    response.prev = {
      page: page - 1,
      limit
    }
  }
  response.response = query.slice(startI, endI)
  return response;
}

app.listen(port, () => console.log(`listening to ${port}`))
