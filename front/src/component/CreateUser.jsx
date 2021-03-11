import { Dialog, Snackbar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function CreateUser(props) {
  const { newUser, handleNew, getUsers } = props;

  const [status, handleStatus] = useState('');
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
        if (response.data.resp.status == 'user exist') {
          handleStatus(response.data.resp.status);
        }
        else if(response.data.resp.status == "user created") {
          alert('created')
          handleNew(prev => !prev)
          getUsers();
        }
      
      })
      .catch(function (error) {
        alert(JSON.stringify(error))
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
          <p className="text-danger">{status}</p>
          <form onSubmit={(event)=>{
           event.persist(); 
           event.stopPropagation();
           event.preventDefault()
            createuser()}} className="form">
            <div className="form p-2">
              <input required onChange={(e) => handleName(e.target.value)} placeholder={'Name'} id="name" required />
            </div>
            <div className="form p-2">
              <input required type="email" onChange={(e) => handleEmail(e.target.value)} placeholder={'Email'} id="email" />
            </div>
            <div className="form p-2">
              <input type="submit" value="Create User" className="btn btn-success" value="Create User" />
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
