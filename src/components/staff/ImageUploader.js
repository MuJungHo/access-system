import React, { useRef } from "react";

import { makeStyles } from '@material-ui/core/styles';
import {
  // Paper,
  // Divider,
  Button,
  IconButton,
  Typography,
  ButtonBase
} from '@material-ui/core'

import {
  Delete,
} from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    height: 150,
    width: 150,
    border: '1px solid' + theme.palette.primary.main,
    borderStyle: 'dashed',
    borderRadius: 5,
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageTitle': {
        display: 'block'
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageTitle: {
    color: 'black',
    position: 'relative',
    display: 'none'
    // padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
}));

export default ({ image = "", onChange = () => { }, onClean = () => { }, style }) => {
  const fileRef = useRef()

  const classes = useStyles();
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

  return (
    <div
      style={{ ...style }}>
      <input
        ref={fileRef}
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
        // multiple
        onChange={handleFileRead}
        type="file"
      />
      <ButtonBase
        focusRipple
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        onClick={() => fileRef.current.click()}
      >
        {
          image
            ?
            <React.Fragment>
              <span
                style={{
                  backgroundSize: 'cover',
                  width: 148,
                  height: 148,
                  backgroundImage: `url("data:image/png;base64, ${image}")`,
                }}
              />
              <span className={classes.imageButton}>
                <Delete className={classes.imageTitle} onClick={(e) => {
                  e.stopPropagation()
                  fileRef.current.value = ""
                  onClean()
                }} />
              </span>
              {/*  */}
            </React.Fragment>
            :
            "上傳圖片"
        }
      </ButtonBase>
    </div>)
}