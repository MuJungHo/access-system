import React, { useRef } from "react";

import {
  // Paper,
  // Divider,
  Button,
  IconButton,
} from '@material-ui/core'

import {
  Delete,
} from '@material-ui/icons';

export default ({ image = "", onChange = () => { }, onClean = () => { } }) => {
  const fileRef = useRef()

  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    let base64 = await convertBase64(file)
    base64 = base64.split(",")[1]
    onChange(base64)
    // setState({
    //   ...state,
    //   photo: base64
    // })
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  return (<React.Fragment>
    <input
      ref={fileRef}
      accept="image/png, image/jpeg"
      style={{ display: 'none' }}
      id="contained-button-file"
      // multiple
      onChange={handleFileRead}
      type="file"
    />
    {
      image
        ? <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`data:image/png;base64, ${image}`} style={{ maxWidth: 50, maxHeight: 50, }} />
          <IconButton onClick={() => {
            fileRef.current.value = ""
            onClean()
            // setState({
            //   ...state,
            //   photo: ""
            // })
          }}><Delete /></IconButton>
        </div>
        : <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" variant="outlined" component="span">
            {"上傳"}
          </Button>
        </label>
    }
  </React.Fragment>)
}