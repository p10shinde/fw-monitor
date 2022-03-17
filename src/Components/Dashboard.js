import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Container from "@mui/material/Container";
import LoadAccount from "./LoadAccount";
import Donations from "./Donations";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import _ from "underscore";
import FWWIcon from "../Assets/images/FWW.png";
import FWFIcon from "../Assets/images/FWF.png";
import FWGIcon from "../Assets/images/FWG.png";
import { getExchangeFees, getTokenPrices } from "../Actions/services";

let DEFAULT_ACCOUNT = [];
const FEE_UPDATE_DURATION = 1; // Fee gets updated every hour
if (
  localStorage.getItem("ids") !== "" &&
  localStorage.getItem("ids") !== null
) {
  DEFAULT_ACCOUNT = JSON.parse(localStorage.getItem("ids"));
} else {
  DEFAULT_ACCOUNT = [
    // "4rfqu.wam",
    // { account: "irjau.wam", alias: "whale1" },
    { account: "wtqxo.wam", alias: "mainAcc" },
    // { account: "uayjo.wam", alias: "shinde24pankaj" },
    // { account: ".c1.s.c.wam", alias: "bsa" },
    // { account: "21l1c.c.wam", alias: "p.p.s" },
    // { account: "ioh1q.c.wam", alias: "af2" },
    // { account: "l2h1u.c.wam", alias: "af3" },
    // "x2w.w.c.wam",
    // "5bfmi.c.wam",
    // "2ku2i.c.wam",
    // "m4w2i.c.wam",
    // "w5v12.c.wam",
    // "hrwmi.c.wam",
  ];
  localStorage.setItem("ids", JSON.stringify(DEFAULT_ACCOUNT));
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AccountRenderer = ({ account }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      style={{
        background: "#0063cc",
        padding: 5,
        borderRadius: 4,
        color: "#fff",
        height: 20,
      }}
    >
      <span
        style={{ alignSelf: "center", paddingLeft: 2, cursor: "pointer" }}
        onClick={(e) => {
          console.log(e.target);
        }}
      >
        {account.account} {account.alias && `(${account.alias})`}
      </span>
      <IconButton
        aria-label="delete"
        size="small"
        style={{ padding: 1, height: 20, width: 20 }}
        color="error"
        style={{ backgroundColor: "white" }}
        onClick={(e) => {
          console.log("Can not delete right now");
        }}
      >
        <DeleteIcon style={{ height: 20, width: 20 }} />
      </IconButton>
    </Stack>
  );
};

function Dashboard() {
  const accountForm = React.useRef(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [refreshInterval] = useState(2000 * 60);
  const [accountNames, setAccountNames] = useState(DEFAULT_ACCOUNT);
  const [tokenPrices, setTokenPrices] = useState([]);
  const [exchangeFee, setExchangeFees] = useState({
    current_fee: null,
    next_fee_update_at: null,
  });

  const myInterval = setInterval(() => {
    clearInterval(myInterval);
    setIsButtonClicked(!isButtonClicked);
  }, refreshInterval);

  const updateApp = (val) => {
    setIsButtonClicked(!isButtonClicked);
  };

  const addAccount = () => {
    const form = accountForm.current;
    const addAccs = form["accountList"].value.replaceAll(" ", "");
    const addAlas = form["aliasList"].value.replaceAll(" ", "");

    let accList = [];
    let aliasList = [];
    accList = addAccs.split(",");
    aliasList = addAlas.split(",");
    let accLst = [];
    if (accList.length === aliasList.length && accLst) {
      // ADD
      accList.forEach((acc, index) => {
        if (
          accountNames.filter((accnm) => accnm.account === acc).length === 0 &&
          acc !== ""
        ) {
          const accObj = {
            account: acc,
            alias: aliasList[index],
          };
          accLst.push(accObj);
        }
      });
      // Append

      const mergedAccnts = [...accountNames, ...accLst];
      setAccountNames(mergedAccnts);
      localStorage.setItem("ids", JSON.stringify(mergedAccnts));
    } else {
      // NOTIFY: Only accounts were added, all alias were not provided
    }
  };

  const removeAllAccounts = () => {
    setAccountNames([]);
    localStorage.setItem("ids", []);
  };

  useEffect(() => {
    getTokenPrices()
      .then((tokenP) => {
        setTokenPrices(tokenP);
      })
      .catch((error) => {
        console.log(error);
      });

    getExchangeFees()
      .then((data) => {
        const exchFee = data.fee;
        const lastFeeUpdated = data.last_fee_updated;
        const nextFeeUpdateAt = new Date(lastFeeUpdated * 1000).setHours(
          new Date(lastFeeUpdated * 1000).getHours() + FEE_UPDATE_DURATION
        );
        const reminingTimeForUpdate = new Date(nextFeeUpdateAt - new Date())
          .toISOString()
          .substr(11, 8);
        setExchangeFees({
          current_fee: exchFee,
          next_fee_update_at: reminingTimeForUpdate,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isButtonClicked]);

  return (
    <div
      style={
        {
          // paddingTop: 50,
          // backgroundColor: "#E7EBF0",
        }
      }
      className="bgimg"
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Donations />
      </div>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Grid container spacing={2} style={{}}>
          <Grid item xs={11} style={{ margin: "auto" }}>
            <Item>
              <div style={{ display: "flex", flexDiretion: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 5,
                    alignItems: "center",
                  }}
                >
                  {Object.keys(tokenPrices).map((key, index) => {
                    let icon;
                    key === "FWW"
                      ? (icon = FWWIcon)
                      : key === "FWF"
                      ? (icon = FWFIcon)
                      : (icon = FWGIcon);
                    return (
                      <div style={{ width: 100 }} key={index}>
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 5,
                          }}
                        >
                          <img
                            width="30px"
                            src={icon}
                            style={{ background: "white", borderRadius: "50%" }}
                          />
                          <span style={{ alignSelf: "center", padding: 5 }}>
                            {tokenPrices[key]}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="flx">
                    <div
                      style={{
                        width: 80,
                        flexDirection: "column",
                        rowGap: 5,
                      }}
                      className="flx"
                    >
                      <span
                        className={`fees ${
                          exchangeFee.current_fee === 5
                            ? "feesLowest"
                            : exchangeFee.current_fee === 6
                            ? "feesLow"
                            : exchangeFee.current_fee === 7
                            ? "feesMed"
                            : "feesHigh"
                        }`}
                      >
                        {exchangeFee.current_fee}%
                      </span>
                      <Fab
                        variant="extended"
                        size="small"
                        className="fabText feeUpdateTimer"
                        aria-label="Time left for fee update"
                      >
                        {exchangeFee.next_fee_update_at}
                      </Fab>
                    </div>
                  </div>
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Grid container spacing={2} style={{ marginBottom: 10 }}>
          <Grid item xs={11} style={{ margin: "auto" }}>
            <Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                <form
                  ref={accountForm}
                  style={{ display: "flex", columnGap: 10 }}
                >
                  <TextField
                    id="accountsList"
                    label="Account names"
                    name="accountList"
                    variant="standard"
                    style={{ width: 300 }}
                  />
                  <TextField
                    id="accountsAlias"
                    label="Account Alias (Optional - All or None)"
                    name="aliasList"
                    variant="standard"
                    style={{ width: 300 }}
                  />
                </form>
                <Button
                  variant="contained"
                  onClick={addAccount}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                  }}
                  onClick={removeAllAccounts}
                >
                  Remove All
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 10,
                  rowGap: 10,
                  flexWrap: "wrap",
                  marginTop: 15,
                }}
                className="accountListRenderer"
              >
                {accountNames.map((account, index) => {
                  return <AccountRenderer account={account} key={index} />;
                })}
              </div>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginBottom: 50 }}>
          {accountNames.length > 0 ? (
            accountNames.map((account, index) => (
              <Grid item xs={12} key={index}>
                <LoadAccount
                  isButtonClicked={isButtonClicked}
                  updateApp={updateApp}
                  account={account.account}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Item style={{ padding: "100px 0 100px 0", fontSize: 25 }}>
                Please enter wax wallet addresses above to start monitoring your
                assets.
              </Item>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
