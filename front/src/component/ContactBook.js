import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Dialog, List, ListItem, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export default function ContactBook() {
  const [users, handleUsers] = useState([])
  const [contactModal, handleModal] = useState(false)
  const [activeUser, handleActive] = useState(null)

  const nameClick = (user) => {
    handleActive(user)
    handleModal(prev => !prev)
  }

  const deleteUser = (userEmail) => {
    let config = {
      method: 'patch',
      url: `http://localhost:4000/deleteuser/${userEmail}`,
    };

    axios(config)
      .then(function (response) {
        handleUsers(response.data.users)
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const dialogFunction = () => {
    return (
      (activeUser) ? (
        <Dialog onClose={() => {
          handleModal(prev => !prev)
        }} aria-labelledby="simple-dialog-title" open={contactModal}>
          <div className="p-4 ">
            <p className="text-center">Contact Info</p>
            <p>{`Name: ${activeUser.name}`}</p>
            <p>{`Email: ${activeUser.email}`}</p>
          </div>
        </Dialog>
      ) : null
    )
  }

  const getUsers = () => {
    let config = {
      method: 'get',
      url: 'http://localhost:4000/getusers',
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        handleUsers(response.data.response)
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <div className="container p-2">
      <div className="col-12 ">
        <List component="nav" aria-label="main mailbox folders">
          {users.map((val, index) => {
            return <div className="col-xl-6 col-lg-4 col-md-10 col-sm-10  p-1" key={index}>
              <ListItem button>
                <ListItemIcon onClick={() => deleteUser(val.email)}>
                  <DeleteIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={`Name: ${val.name}`} onClick={() => nameClick(val)} />
              </ListItem>
            </div>
          })}
        </List>
      </div>
      {dialogFunction()}
    </div>
  )
}
