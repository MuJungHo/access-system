import React, { useRef, useContext } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
  Delete,
  AddBox,
  LiveTv,
  Stop,
  PlayArrow,
  CropFree
} from '@material-ui/icons';

import {
  IconButton,
  Paper
} from '@material-ui/core'
import { palette } from "../../customTheme";

const useStyles = makeStyles((theme) => ({
  player: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 12,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 5,
    '& svg': {
      width: '100%'
    }
  },
  grid: {
    height: 315,
    width: 490,
  },
  full: {
    height: 'calc(100vh - 135px)',
    width: '100%',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const Player = ({
  onDelete,
  isSelected,
  player,
  handleCheckPlayer,
  isGrid
}) => {
  // console.log(id)
  const classes = useStyles();
  const videoRef = useRef()
  const wsRef = useRef()
  const md5 = require("md5");
  const [isPlaying, setPlaying] = React.useState(true)
  const [bitrate, setBitrate] = React.useState(`000.000 Kbps, 00 Fps`)
  const [fname, setFname] = React.useState('Time Offset : 0')

  var sourceBuffer, mediaSource, video;
  var queue = [];
  var new_codec_string;
  var old_codec_string;
  const token = localStorage.getItem('token')
  const timestamp = Date.now()
  const sign = md5(timestamp + '#' + token)

  React.useEffect(() => {
    if (player.device._id === "") return
    InitWebSocket()
    return () => {
      wsRef.current.close();
    }
  }, [player.device._id])

  const InitWebSocket = () => {
    wsRef.current = new WebSocket(`ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/live?device=${player.device._id}&timestamp=${timestamp}&sign=${sign}`);
    wsRef.current.binaryType = "arraybuffer";
    wsRef.current.onopen = () => console.log('player ws opened');
    wsRef.current.onclose = () => console.log('player ws closed');
    wsRef.current.onmessage = evt => {
      setPlaying(true)
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

        setBitrate(`${subdata.byteLength / 1000} Kbps, ${fps}Fps`)

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
  }
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
      // video.muted = true;

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
            setTimeout(function () {
              video.play();
            }, 150)
          }

        });

      }, false);
    }
  }
  const EmptyPlayer = () => {
    const classes = useStyles();
    return (
      <div
        onClick={handleCheckPlayer}
        style={{
          cursor: 'pointer',
          border: `2px solid ${isSelected ? palette.primary.main : 'rgba(0, 0, 0, 0.23)'}`
        }}

        className={clsx(classes.player, classes.empty, {
          [classes.grid]: isGrid,
          [classes.full]: !isGrid,
        })}>
        <LiveTv style={{ width: "60%", height: "60%", margin: 'auto', color: isSelected ? palette.primary.main : 'rgba(0, 0, 0, 0.23)' }} />
      </div>)
  }
  if (player.device._id === "") return <EmptyPlayer />

  return (
    <div
      className={clsx(classes.player, {
        [classes.grid]: isGrid,
        [classes.full]: !isGrid
      })}
      onClick={handleCheckPlayer}
      style={{
        color: '#fff',
        cursor: 'pointer',
        backgroundColor: '#000',
        border: `2px solid ${isSelected ? palette.primary.main : 'rgba(0, 0, 0, 0.23)'}`
      }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1 }}>{`${player.device.name}/${bitrate}/${fname}`}</span>
        <IconButton
          style={{ color: '#fff' }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}>
          <Delete />
        </IconButton>
        {
          isPlaying
            ?
            <IconButton
              style={{ color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation()
                wsRef.current.close()
                setPlaying(false)
              }}>
              <Stop />
            </IconButton>
            :
            <IconButton
              style={{ color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation()
                InitWebSocket()
                setPlaying(true)
              }}>
              <PlayArrow />
            </IconButton>
        }


      </div>
      <video
        width="100%"
        height="auto"
        muted
        ref={videoRef}
        style={{ margin: 'auto', display: 'block' }}
      />
    </div>
  )
}

export default Player