import { Dialog, Snackbar } from '@material-ui/core'
import React, { useState } from 'react'
import axios from 'axios';

export default function CreateUser(props) {
  const { newUser, handleNew, getUsers } = props;

  const [open, handleOpen] = useState(false)
  const [name, handleName] = useState('')
  const [email, handleEmail] = useState('')

  const createuser = () => {
    var data = JSON.stringify({ "name": name, "email": email });

    var config = {
      method: 'post',
      url: 'http://localhost:4000/createUser',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        handleOpen(prev => !prev)
        getUsers()
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div>
      <Dialog
        onClose={() => {
          handleNew(prev => !prev)
        }}
        open={newUser}
        aria-labelledby="simple-dialog-title"
      >
        <div className="p-4">

          <p className="text-center">Create User</p>
          <form onSubmit={createuser} className="form">
            <div className="form p-2">
              <input required onChange={(e) => handleName(e.target.value)} placeholder={'Name'} id="name" required />
            </div>
            <div className="form p-2">
              <input required type="email" onChange={(e) => handleEmail(e.target.value)} placeholder={'Email'} id="email" />
            </div>
            <div className="form p-2">
              <input type="submit" value="Create User" className="btn btn-success" value="Subscribe!" />
            </div>
          </form>
        </div>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        message={`Created User ${name}`}
        onClose={() => {
          handleOpen(prev => !prev)
        }}
      />
    </div>
  )
}
