import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { List, ListItem, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ContactInfo from './ContactInfo';
import CreateUser from './CreateUser';

export default function ContactBook() {
  const [users, handleUsers] = useState([])
  const [contactModal, handleModal] = useState(false)
  const [activeUser, handleActive] = useState(null)
  const [newUser, handleNew] = useState(false)

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
        console.log(response)
        getUsers()
      })
      .catch(function (error) {
        console.log(error);
      });

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
  console.log(newUser)
  useEffect(() => {
    getUsers()
  }, [])
  return (
    <div className="container p-2">
      <div className="d-flex  row">
        <div className="col-3 ">
          <input placeholder="Search"></input>
        </div>
        <div className="col-4">
          <button className="btn btn-primary" onClick={() => {
            handleNew(prev => !prev)
          }}>New User</button>
        </div>
      </div>
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

      {(activeUser) ? (
        <>
          <ContactInfo
            getUsers={getUsers}
            handleModal={handleModal}
            name={activeUser.name}
            email={activeUser.email}
            contactModal={contactModal}
          />
        </>) : null}
      <CreateUser
        newUser={newUser}
        handleNew={handleNew}
        getUsers={getUsers}
      />
    </div>
  )
}
