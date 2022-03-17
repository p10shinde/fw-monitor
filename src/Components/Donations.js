import React, { useEffect, useState } from "react";
import { WaxIcon } from "./icons/index";
import { EthIcon } from "./icons/index";
import { BtcIcon } from "./icons/index";
import Tooltip from "@mui/material/Tooltip";
import { FaRegCopy } from "react-icons/fa";

const Donations = ({}) => {
  const cryptoAddresses = [
    {
      icon: <WaxIcon style={{ width: 20, height: 20 }} />,
      address: "uayjo.wam",
      type: "WAX",
    },
    {
      icon: (
        <EthIcon
          style={{
            width: 20,
            height: 20,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        />
      ),
      address: "0x34ee494a15De8edafEcf5bFae705b09B0832D698",
      type: "ETH",
    },
    {
      icon: <BtcIcon style={{ width: 20, height: 20 }} />,
      address: "bc1qt7hnl2ymuqy6j45fcc4adxmqn6jnhwcjpe9fur",
      type: "BTC",
    },
  ];
  const copyText = (address) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div style={{ backgroundColor: "black", color: "white" }}>
      <div style={{ display: "flex" }}>
        {cryptoAddresses.map((crypto, index) => (
          <Tooltip title="Click to copy" key={index}>
            <div
              style={{
                display: "flex",
                padding: "5px 5px 0 5px",
                columnGap: 10,
                alignSelf: "flex-start",
                cursor: "pointer",
              }}
              onClick={() => {
                copyText(crypto.address);
              }}
            >
              <span>{crypto.icon}</span>
              <span style={{ flex: 1 }}>{crypto.address}</span>
              <FaRegCopy />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Donations;
