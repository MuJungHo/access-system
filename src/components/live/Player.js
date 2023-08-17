import React, { useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import {
  Delete,
  AddBox
} from '@material-ui/icons';

import {
  IconButton,
  Paper
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
    height: 340,
    width: 512,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 5,
  },
}));
const EmptyPlayer = ({ handleCheckPlayer, isSelected }) => {
  const classes = useStyles();
  return (
    <div
      onClick={handleCheckPlayer}
      style={{
        cursor: 'pointer',
        border: `1px solid ${isSelected ? 'red' : 'rgba(0, 0, 0, 0.54)'}`
      }}
      className={classes.content}>
      {/* <IconButton onClick={}><AddBox /></IconButton> */}
    </div>)
}

const Player = ({ onDelete, isSelected, player, handleCheckPlayer }) => {
  // console.log(id)
  const classes = useStyles();
  const videoRef = useRef()
  const wsRef = useRef()
  const md5 = require("md5");
  const [bitrate, setBitrate] = React.useState("")
  const [fname, setFname] = React.useState("")

  React.useEffect(() => {
    if (player.device._id === "") return

    var ws = wsRef.current
    var sourceBuffer, mediaSource, video;
    var queue = [];
    var new_codec_string;
    var old_codec_string;
    const token = localStorage.getItem('token')
    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    // ws = new WebSocket('wss://' + process.env.REACT_APP_DOMAIN + '/cgi-bin/live?device=20&timestamp=1622706598604&sign=fe75a05683e151dc52d7551d81d50b8c');

    ws = new WebSocket(`ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/live?device=${player.device._id}&timestamp=${timestamp}&sign=${sign}`);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => console.log('player ws opened');
    ws.onclose = () => console.log('player ws closed');
    ws.onmessage = evt => {

      if (evt.data.byteLength > 128) {

        var ext_data = new DataView(evt.data, evt.data.byteLength - 32, 32);

        var fps = ext_data.getUint8(0);

        var video_width = ext_data.getUint8(1) * 256 + ext_data.getUint8(2);
        var video_height = ext_data.getUint8(3) * 256 + ext_data.getUint8(4);
        var vodeo_type;

        if (ext_data.getUint8(5) == 3)
          vodeo_type = 'H.264';
        else if (ext_data.getUint8(5) == 4)
          vodeo_type = 'H.265';

        DataView.prototype.getString = function (offset, length) {
          var end = typeof length == 'number' ? offset + length : this.byteLength;
          var text = '';
          var val = -1;

          while (offset < this.byteLength && offset < end) {
            val = this.getUint8(offset++);
            if (val == 0) break;
            text += String.fromCharCode(val);
          }

          return text;
        };

        var ext_codec_string_view = new DataView(evt.data, evt.data.byteLength - 32 - 42, 42);

        new_codec_string = ext_codec_string_view.getString(0, 42);

        var subdata = new DataView(evt.data, 0, evt.data.byteLength - 128);

        setBitrate(vodeo_type + ', ' + subdata.byteLength / 1000 + ' Kbps' + ', ' + fps + "Fps, " + video_width + "x" + video_height + ", codecstring=" + new_codec_string)

        if (old_codec_string != new_codec_string) {

          old_codec_string = new_codec_string;

          InitMediaSource();
        }

        if (sourceBuffer != null) {
          if (!sourceBuffer.updating && video.buffered.length && video.currentTime - video.buffered.start(0) > 1) {
            sourceBuffer.remove(0, video.currentTime - 1);
          }

          if (sourceBuffer.updating || queue.length > 0) {
            queue.push(subdata);

          } else {

            try {
              sourceBuffer.appendBuffer(subdata);
            }
            catch (e) {
              console.log(e);
            }

          }
        }
      }

    };

    const InitMediaSource = () => {

      if (mediaSource != null) {

        if (sourceBuffer != null) {
          mediaSource.removeSourceBuffer(sourceBuffer);
          sourceBuffer = null;
        }

        mediaSource = null;
      }

      var mimeCodec = 'video/mp4; codecs="' + old_codec_string + '"';
      // console.log(old_codec_string + '=' + MediaSource.isTypeSupported(mimeCodec));
      if (MediaSource.isTypeSupported(mimeCodec)) {
        // Create Media Source
        mediaSource = new MediaSource();

        // Get video element
        video = videoRef.current;
        video.src = window.URL.createObjectURL(mediaSource);
        video.muted = true;

        mediaSource.addEventListener('sourceopen', function (_) {
          sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
          sourceBuffer.mode = 'sequence';

          sourceBuffer.addEventListener('updateend', function (_) {

            //  console.log('updateend: ' + mediaSource.readyState);

            if (sourceBuffer.timestampOffset - video.currentTime > 2) {
              video.currentTime = sourceBuffer.timestampOffset;
              //     console.log("adjust offset");		//for latency to high
            }

            setFname('Time Offset : ' + video.currentTime)

            if (queue.length > 0 && !sourceBuffer.updating) {

              try {
                sourceBuffer.appendBuffer(queue.shift());
              }
              catch (e) {
                console.log(e);
              }
            }

            if (video.pause) {
              video.play();
            }

          });

        }, false);
      }
    }
    return () => {
      ws.close();
    }
  }, [player.device._id])

  if (player.device._id === "") return <EmptyPlayer isSelected={isSelected} handleCheckPlayer={handleCheckPlayer} />

  return (
    <div
      className={classes.content}
      onClick={handleCheckPlayer}
      style={{
        color: '#fff',
        cursor: 'pointer',
        backgroundColor: '#000',
        border: `1px solid ${isSelected ? 'red' : '#fff'}`
      }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1 }}>{player.device.name}</span>
        <IconButton style={{ color: '#fff' }} onClick={() => onDelete()}><Delete /></IconButton>
      </div>
      <video
        width="100%"
        height="auto"
        ref={videoRef}
        style={{ margin: 'auto', display: 'block' }}
      />
    </div>
  )
}

export default Player