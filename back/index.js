const Express = require('express');
const bodyParser = require('body-parser');

const app = Express();
app.use(bodyParser.json());
const port = 3000;


let contactBook = []
// Creating User
app.post('/createuser', (req, res) => {
  if (contactBook.find(val => val.email === req.body.email) == undefined) {
    contactBook.push(req.body)
  }
  else {
    res.json({
      "resp": {
        "status": "user exist"
      }
    })
  }
  res.json({
    "resp": {
      "status": "user created",
      "users": contactBook[contactBook.length - 1]
    }
  })
})

// Delete
app.patch('/deleteuser/:deleteId', (req, res) => {
  let newarray = contactBook;
  if (req.params.deleteId) {
    contactBook = newarray.filter(val => {                                                   // Updating the main array of users 
      return val.email !== req.params.deleteId;
    });
    res.json({ "status": "success", "users": contactBook, "action": "deleted" })
  }
})

// Update
app.patch('/updateuser', (req, res) => {
  let newarray = contactBook;
  // This section is updating -----v
  contactBook = newarray.map(val => {
    if (val.email === req.body.email) {
      return {
        name: req.body.name,
        email: val.email
      }
    }
    else {
      return val
    }
  })
  res.json({ "status": "success", "users": contactBook, "action": "updated" })
})

// Get users
app.get('/getusers', (req, res) => {
  let { page = 1, limit = 5 } = req.query;
  page = parseInt(page)
  limit = parseInt(limit)
  let response = paginateMe(page, limit, contactBook)
  res.json(response)
})

// Search
app.get('/search' , (req,res) => {
  let { page = 1, limit = 5 } = req.query;
  let {name = null ,email = null } = req.body;
  page = parseInt(page)
  limit = parseInt(limit)
  let search = []
  if (name) {    // search by name if name is passed inside body
    search = contactBook.filter(val => {                                                 
      return name === val.name.slice(0,name.length);
    })
  } 
  else if(email) { // search by email if email is passed inside body
    search = contactBook.filter(val => {                                                 
      return email === val.email.slice(0,email.length);
    })
  }
  let response = paginateMe(page, limit, search)
  res.json(response)
})

// Paginate
const paginateMe = (page, limit, query) => {
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

app.listen(port, () => console.log(`listening to ${port}`));
