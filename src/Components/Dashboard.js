import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import LoadAccount from "./LoadAccount";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const DEFAULT_ACCOUNT = [
  // "4rfqu.wam",
  // "irjau.wam",
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
];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Dashboard() {
  const [accounts] = useState(DEFAULT_ACCOUNT);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [refreshInterval] = useState(2000 * 60);
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
        <Grid container spacing={2} style={{ marginBottom: 10 }}>
          <Grid item xs={12}>
            <Item>Heyy</Item>
          </Grid>
        </Grid>
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
