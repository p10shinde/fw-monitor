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
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const LoadAccount = ({ isButtonClicked, updateApp, account }) => {
  const [isAnyToolTimedout, setIsAnyToolTimedout] = useState(false);
  const [isAnyCropTimedOut, setIsAnyCropTimedOut] = useState(false);
  const [isMining, setIsMining] = useState(true);
  const [notifySound, setNotifySound] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAccountMuted, setIsAccountMuted] = useState(false);
  const [isSoundStopped, setIsSoundStopped] = useState(false);
  const [isCurrentUserUpdateRequested, setIsCurrentUserUpdateRequested] =
    useState(false);

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
      // if (account !== "irjau.wam") 
      play();

      setIsAnyToolTimedout(false);
      if (!isAccountMuted) {
        setIsPlaying(true);
      }
    }

    if (isAnyCropTimedOut) {
      // if (account !== "irjau.wam") 
      play();
      setIsAnyCropTimedOut(false);
      if (!isAccountMuted) {
        setIsPlaying(true);
      }
    }
  }, [isAnyToolTimedout, isAnyCropTimedOut]); // eslint-disable-line react-hooks/exhaustive-deps

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
            className={`normalButton ${isPlaying ? "alarming" : ""}`}
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
              className={`normalButton`}
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
              className={`normalButton alarm_activated`}
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
            onClick={(item) =>
              setIsCurrentUserUpdateRequested(!isCurrentUserUpdateRequested)
            }
          >
            {account}
          </Fab>
        </div>
        <Tooltip title="Refresh All Accounts">
          <div
            onClick={(item) => updateApp()}
            className={`normalButton`}
            style={{ backgroundColor: "#00bcd4", color: "white" }}
          >
            <RefreshIcon />
          </div>
        </Tooltip>
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
              isCurrentUserUpdateRequested={isCurrentUserUpdateRequested}
            />
          </div>
        )}
        {/* CROPS */}
        <div style={{ flex: 2 }}>
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
export default LoadAccount;
