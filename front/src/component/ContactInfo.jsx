import { Dialog } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';

export default function ContactInfo(props) {
  const { handleModal, name, email, contactModal ,getUsers} = props;
  const [updateFlag, handleFlag] = useState(false);
  const [updateName, handleUpdatedName] = useState('')

  const update = () => {
    var data = JSON.stringify({ "name": updateName, "email": email });
    var config = {
      method: 'patch',
      url: 'http://localhost:4000/updateuser',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response)
        getUsers()
        handleModal(prev => !prev)
        handleFlag(false)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(()=>{
    handleFlag(false)
  },[])
  
  return (
    <div>
      <Dialog onClose={() => {
        handleModal(prev => !prev)
      }} aria-labelledby="simple-dialog-title" open={contactModal}>
        <div className="p-4 ">
          <p className="text-center">{updateFlag ? 'Update Info' : 'Contact Info'}</p>
          <div className="justify-content-end d-flex">
            <EditIcon onClick={() => {
              handleFlag(prev => !prev)
            }} />
          </div>
          {updateFlag ? (
            <div>
              <input placeholder={'Enter New Name'} onChange={(e) => handleUpdatedName(e.target.value)}></input>
              <p>{`Email: ${email}`}</p>
              <div className="p-1 d-flex justify-content-center">
                <button onClick={update} className="btn btn-primary">Update</button>
              </div>
            </div>
          ) : (
            <div>
              <p>{`Name: ${name}`}</p>
              <p>{`Email: ${email}`}</p>
            </div>
          )}

        </div>
      </Dialog>

    </div>
  )
}
