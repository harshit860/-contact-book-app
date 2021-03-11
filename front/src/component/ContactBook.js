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
  const [next, handleNext] = useState(true)
  const [prev, handlePrev] = useState(true)
  const [nextPg, handleNextPg] = useState('')
  const [prevPg, handlePrevPg] = useState('')
  const [message,handleMessage] = useState('')

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        console.log('hi')
        fn(...args);
      }, delay)
    };
  }

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

  const search = debounce(
    (e) => {
      var data = JSON.stringify({ "email": e.target.value, "name": e.target.value });

      var config = {
        method: 'post',
        url: 'http://localhost:4000/search',
        headers: {
          'Content-Type': 'application/json'
        },
       data : data
      }

      axios(config)
        .then(function (response) {
          if(response.data.response.length == 0)
          {
            
            handleMessage('No result found | Fetching all ...')
            setTimeout(()=>{
              handleMessage('')
              getUsers()
            },1500)
          }
          if (response.data.next) {
            handleNext(false)
            handleNextPg(`?page=${response.data.next.page}`)
          }
          else {
            handleNext(true)
          }
          if (response.data.prev) {
            handlePrev(false)
            handlePrevPg(`?page=${response.data.prev.page}`)
          }
          else {
            handlePrev(true)
          }
  
          handleUsers(response.data.response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 1000)

  const getUsers = (check = null) => {
    let url = 'http://localhost:4000/getusers'
    if (check == 'next') {
      url = url + nextPg
    }
    if (check == 'prev') {
      url = url + prevPg
    }
    let config = {
      method: 'get',
      url: url
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        if (response.data.next) {
          handleNext(false)
          handleNextPg(`?page=${response.data.next.page}`)
        }
        else {
          handleNext(true)
        }
        if (response.data.prev) {
          handlePrev(false)
          handlePrevPg(`?page=${response.data.prev.page}`)
        }
        else {
          handlePrev(true)
        }

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
    <div className="container p-2 col-12 ">
      <div className="d-flex row">
        <div className="col-xl-7 col-lg-10 col-md-12 col-sm-12 row d-flex justify-content-around">
          <input onChange={(e) => {
            e.persist()
            search(e)
          }} className="col-8" placeholder="Search"></input>
          <button className="col-1 btn btn-primary" onClick={() => {
            handleNew(prev => !prev)
          }}>+</button>
        </div>
        <div className="p-2">
          <p className="text-danger">{message}</p>
        </div>
      </div>
      <div className="col-12  d-flex ">
        <List component="nav" aria-label="main mailbox folders">
          {users.map((val, index) => {
            return <div className="col-xl-12 col-lg-8 col-md-11 col-sm-11 p-1" key={index}>
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

      <div className="row col-7 justify-content-around">
        <button onClick={() => getUsers('prev')} disabled={prev} className="btn btn-success col-3 p-1 ml-1">Prev</button>
        <button onClick={() => getUsers('next')} disabled={next} className="btn btn-success col-3 p-1 ">Next</button>
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
