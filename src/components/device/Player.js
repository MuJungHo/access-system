import React, { useRef, useContext } from 'react'
import { AuthContext } from "../../contexts/AuthContext";


import {
  Paper,

  Divider,
} from '@material-ui/core'

const Player = ({ id }) => {
  // console.log(id)
  const videoRef = useRef()
  const { token } = useContext(AuthContext);
  const md5 = require("md5");

  React.useEffect(() => {

    if (!id) return

    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    const wsuri = `ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/live?device=${id}&sign=${sign}&timestamp=${timestamp}`
    const ws = new WebSocket(wsuri);
    ws.binaryType = "arraybuffer";
    const mimeCodec = 'video/mp4; codecs="avc1.4d001f"';
    const source = new MediaSource();
    const url = URL.createObjectURL(source);
    const video = videoRef.current;
    const queue = []
    video.src = url;
    source.addEventListener('sourceopen', () => {
      const videoSourceBuffer = source.addSourceBuffer(mimeCodec);
      videoSourceBuffer.addEventListener('error', console.log);
      videoSourceBuffer.addEventListener('updateend', () => {
        video.currentTime = videoSourceBuffer.timestampOffset
        if (
          queue.length > 0 &&
          !videoSourceBuffer.updating
        ) {
          videoSourceBuffer.appendBuffer(
            queue.shift()
          );
        }

        if (video.pause) video.play();
      })
      ws.onopen = () => console.log('player ws opened');
      ws.onclose = () => console.log('player ws closed');
      ws.onmessage = evt => {
        if (evt.data.byteLength > 32) {
          const dataview = new DataView(evt.data, 0, evt.data.byteLength - 32);

          if (
            !videoSourceBuffer.updating &&
            video.buffered.length &&
            video.currentTime - video.buffered.start(0) > 1
          ) {
            videoSourceBuffer.remove(0, video.currentTime - 1);
          }

          if (
            videoSourceBuffer.updating ||
            queue.length > 0
          ) {
            queue.push(dataview);
          } else {
            videoSourceBuffer.appendBuffer(dataview);
          }
        }
      };
    })
    return () => {
      ws.close();
    }
  }, [md5, token, id])

  return (
    <Paper style={{ margin: 'auto', width: 700, }}>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>播放畫面</span>
      </div>
      <Divider />
      <div style={{ padding: 16 }}>
        <video
          width="660"
          // height="480"
          ref={videoRef}
          style={{ margin: 'auto', display: 'block' }}
        />
      </div>
    </Paper>)
}

export default Player