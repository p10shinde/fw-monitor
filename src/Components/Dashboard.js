import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import LoadAccount from "./LoadAccount";

const DEFAULT_ACCOUNT = [
  "4rfqu.wam",
  "wtqxo.wam",
  "uayjo.wam",
  ".c1.s.c.wam",
  "21l1c.c.wam",
  "l2h1u.c.wam",
  "ioh1q.c.wam",
  "x2w.w.c.wam",
  "5bfmi.c.wam",
  "2ku2i.c.wam",
  "m4w2i.c.wam ",
  "w5v12.c.wam",
  "hrwmi.c.wam",
]

function Dashboard() {
  const [accounts, 
    // setAccounts
  ] = useState(DEFAULT_ACCOUNT);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [refreshInterval, 
    // setRefreshInterval
  ] = useState(2000 * 60);
  const myInterval = setInterval(() => {
    clearInterval(myInterval);
    setIsButtonClicked(!isButtonClicked);
  }, refreshInterval);

  const updateApp = (val) => {
    setIsButtonClicked(!isButtonClicked);
  };

  return (
    <div
      style={{
        paddingTop: 50,
        backgroundColor: "#E7EBF0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {accounts.map((account, index) => ( 
            <Grid item xs={12} key={index}>
              <LoadAccount
                isButtonClicked={isButtonClicked}
                updateApp={updateApp}
                account={account}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
