import React, { useEffect, useContext } from "react";
import "../styles/style.css";
import { getAlcorTokenBalances } from "../Actions/services";
import { getIngameTokenBalances } from "../Actions/services";
import FWWIcon from "../Assets/images/FWW.png";
import FWFIcon from "../Assets/images/FWF.png";
import FWGIcon from "../Assets/images/FWG.png";
import { ReferenceDataContext } from "../Context/ReferenceDataContext";

const PRECISION = 3;

const TokenBalances = ({ account, isCurrentUserUpdateRequested }) => {
  let tBal = {
    FWW: { alcor: 0, ingame: 0, total: 0 },
    FWF: { alcor: 0, ingame: 0, total: 0 },
    FWG: { alcor: 0, ingame: 0, total: 0 },
  };
  const { accDetails, setAccDetails } = useContext(ReferenceDataContext);

  const getTokensAfterFee = (fee) => {
    Object.keys(tBal).map((key, index) => {
      tBal[key].total = Number(
        tBal[key].ingame -
          tBal[key].ingame * (Number(fee) / 100) +
          tBal[key].alcor
      ).toFixed(PRECISION);
      return 0;
    });
    // console.log(tBalances);
  };

  useEffect(() => {
    getAlcorTokenBalances(account)
      .then((alcorBalance) => {
        getIngameTokenBalances(account)
          .then((ingameBalance) => {
            alcorBalance.forEach((tkn) => {
              tBal[tkn.currency].alcor = Number(
                Number(tkn.amount).toFixed(PRECISION)
              );
            });
            ingameBalance.balances.forEach((tkn) => {
              let tData = tkn.split(" ");
              let amount = Number(tData[0]).toFixed(PRECISION);
              tBal[
                tData[1] === "WOOD"
                  ? "FWW"
                  : tData[1] === "FOOD"
                  ? "FWF"
                  : "FWG"
              ].ingame = Number(amount);
            });
            getTokensAfterFee(5);
            setAccDetails({
              ...accDetails,
              tBalances: tBal,
              curr_energy: ingameBalance.energy,
              max_energy: ingameBalance.max_energy,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [isCurrentUserUpdateRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 5,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ height: 30 }}></span>
          <span className="tokenHeader">Alcor ➡️ </span>
          <span className="tokenHeader">In Game ➡️ </span>
          <span className="tokenHeader">Total ➡️ </span>
        </span>
      </div>
      {Object.keys(accDetails.tBalances).map((key, index) => {
        let icon;
        key === "FWW"
          ? (icon = FWWIcon)
          : key === "FWF"
          ? (icon = FWFIcon)
          : (icon = FWGIcon);
        return (
          <div style={{}} key={index}>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 5,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="icon"
                width="30px"
                src={icon}
                style={{ background: "white", borderRadius: "50%" }}
              />
              <span style={{ alignSelf: "center", padding: "0 5px 0 5px" }}>
                {accDetails.tBalances[key].alcor}
              </span>
              <span style={{ alignSelf: "center", padding: "0 5px 0 5px" }}>
                {accDetails.tBalances[key].ingame}
              </span>
              <span
                style={{
                  alignSelf: "center",
                  padding: "0 5px 0 5px",
                  color: "#000000",
                  border: "1px solid grey",
                  borderRadius: 5,
                  backgroundColor: "yellow",
                }}
              >
                {accDetails.tBalances[key].total}
              </span>
            </span>
          </div>
        );
      })}
    </>
  );
};

export default TokenBalances;
