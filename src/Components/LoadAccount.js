import React, { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import ToolsDetails from "./ToolsDetails";
import CropsDetails from "./CropsDetails";
import useSound from "use-sound";
// import notifySfx from "../assets/sounds/siren.wav";
import notifySfx from "../assets/sounds/finger.mp3";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import Tooltip from "@mui/material/Tooltip";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default ({ isButtonClicked, updateApp, account }) => {
  const [isAnyToolTimedout, setIsAnyToolTimedout] = useState(false);
  const [isAnyCropTimedOut, setIsAnyCropTimedOut] = useState(false);
  const [isMining, setIsMining] = useState(true);
  const [notifySound, setNotifySound] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAccountMuted, setIsAccountMuted] = useState(false);
  const [isSoundStopped, setIsSoundStopped] = useState(false);

  const [play, { stop }] = useSound(notifySfx, {
    interrupt: true,
    playbackRate: 1,
    volume: notifySound,
  });

  const updateToolTimeOut = (ifTimedOut) => {
    setIsAnyToolTimedout(ifTimedOut);
  };

  const updateCropTimeOut = (ifTimedOut) => {
    setIsAnyCropTimedOut(ifTimedOut);
  };

  const updateIsMining = (_isMining) => {
    setIsMining(_isMining);
  };

  useEffect(() => {
    if (isAnyToolTimedout) {
      if (account !== "4rfqu.wam") play();

      setIsAnyToolTimedout(false);
      if (!isAccountMuted) {
        setIsPlaying(true);
      }
    }

    if (isAnyCropTimedOut) {
      if (account !== "4rfqu.wam") play();
      setIsAnyCropTimedOut(false);
      if (!isAccountMuted) {
        setIsPlaying(true);
      }
    }
  }, [isAnyToolTimedout, isAnyCropTimedOut]);

  return (
    <Item>
      <div className="accountTitle">
        <Tooltip title="I get it, stop now!!!">
          <div
            onClick={() => {
              stop();
              setIsSoundStopped(!isSoundStopped);
              setIsPlaying(false);
            }}
            className={`soundOffButton ${isPlaying ? "alarming" : ""}`}
          >
            <VolumeOffIcon />
          </div>
        </Tooltip>
        {isAccountMuted ? (
          <Tooltip title="Start alerting for this account">
            <div
              style={{ marginLeft: 10 }}
              onClick={() => {
                setIsAccountMuted(false);
                setNotifySound(0.5);
              }}
              className={`soundOffButton`}
            >
              <VolumeMuteIcon />
            </div>
          </Tooltip>
        ) : (
          <Tooltip title="Stop alerting for this account">
            <div
              style={{ marginLeft: 10 }}
              onClick={() => {
                setIsAccountMuted(true);
                setNotifySound(0);
                setIsPlaying(false);
              }}
              className={`soundOffButton alarm_activated`}
            >
              <VolumeUpIcon />
            </div>
          </Tooltip>
        )}
        <div style={{ flex: 1, lineHeight: 2 }}>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            aria-label="account"
            onClick={(item) => updateApp()}
          >
            {account}
          </Fab>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* MINING */}
        {isMining && (
          <div style={{ flex: 1 }}>
            <div>
              <div className="miningCategory">
                <div style={{ flex: 1, lineHeight: 2 }}>
                  <label>MINING</label>
                </div>
              </div>
            </div>
            <ToolsDetails
              isButtonClicked={isButtonClicked}
              isAnyToolTimedout={isAnyToolTimedout}
              updateToolTimeOut={updateToolTimeOut}
              stop={stop}
              account={account}
              updateIsMining={updateIsMining}
            />
          </div>
        )}
        {/* CROPS */}
        <div style={{ flex: 2 }}>
          {/* <div className="miningCategory">CROPS</div> */}
          <div>
            <div className="miningCategory">
              <div style={{ flex: 1, lineHeight: 2 }}>
                <label>CROPS</label>
              </div>
            </div>
          </div>
          <CropsDetails
            isButtonClicked={isButtonClicked}
            isAnyCropTimedOut={isAnyCropTimedOut}
            updateCropTimeOut={updateCropTimeOut}
            stop={stop}
            account={account}
          />
        </div>
      </div>
    </Item>
  );
};
