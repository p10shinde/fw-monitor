import {
  pipe,
  map,
  toPairs,
  transpose,
  uniqBy,
  last,
  unnest,
  objOf,
  apply,
} from "ramda";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import useSound from "use-sound";
import sirenSfx from "../assets/sounds/siren.wav";
import Grid from "@mui/material/Grid";
// import * as R from "ramda";

import "../styles/style.css";

import _, { pick } from "underscore";

import FW_TEMPLATES from "../Utils/Templates";

const CROPS_DETAILS_URL =
  "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
const USER_ACCOUNT_DETAILS =
  "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
const TOTAL_CLAIMS_PER_SEED = 42;

export default ({
  isButtonClicked,
  isAnyCropTimedOut,
  updateCropTimeOut,
  account,
}) => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);
  const [cropsDetails, setCropsDetails] = useState([]);
  const [cropsLoaded, setCropsLoaded] = useState(false);
  const [cropsCalcDetails, setCropsCalcDetails] = useState({});
  const [userAccountDetails, setUserAccountDetails] = useState({});
  const [play] = useSound(sirenSfx, { interrupt: false });

  const updateCropsCalcDetails = (allCrops) => {
    // allCrops.push({
    //   asset_id: "1099619159455",
    //   building_id: "1099570897194",
    //   dangerTimer: false,
    //   last_claimed: 1643742317,
    //   name: "Barley Seed",
    //   nextClickTime: "01:46:53",
    //   next_availability: 1643756717,
    //   owner: "wtqxo.wam",
    //   src: "BSD.png",
    //   template_id: 298596,
    //   template_name: "BARLEY SEED",
    //   times_claimed: 31,
    // });
    let seed_types = _.unique(_.pluck(allCrops, ["template_name"]));
    let seeds = seed_types.join(", ");

    let total_claims = [];
    seed_types.forEach((seed) => {
      let seed_count = _.where(allCrops, { template_name: seed }).length;

      const claims_completed_for_seed = _.reduce(
        _.pluck(_.where(allCrops, { template_name: seed }), ["times_claimed"]),
        (memo, num) => memo + num
      );
      const remaining_claims =
        TOTAL_CLAIMS_PER_SEED * seed_count - claims_completed_for_seed;
      let foundCropTemplate = _.findWhere(FW_TEMPLATES, {
        template_name: seed,
      });
      const required_food = remaining_claims * foundCropTemplate.required_food;

      total_claims.push({
        template_name: seed,
        claims_completed_for_seed,
        remaining_claims,
        required_food,
      });
    });
    setCropsCalcDetails({
      seeds,
      total_claims_per_seed: TOTAL_CLAIMS_PER_SEED,
      total_claims_completed: _.reduce(
        _.pluck(total_claims, ["claims_completed_for_seed"]),
        (memo, num) => memo + num
      ),
      remaining_claims: _.reduce(
        _.pluck(total_claims, ["remaining_claims"]),
        (memo, num) => memo + num
      ),
      total_required_food: _.reduce(
        _.pluck(total_claims, ["required_food"]),
        (memo, num) => memo + num
      ),
    });
  };

  const getRequiredFood = () => {
    const req_food =
      cropsCalcDetails.total_required_food -
      (userAccountDetails.token_balances?.FOOD +
        Number(userAccountDetails.energy / 5));
    return (
      <span style={{ color: "red" }}>
        {req_food > 0 ? (
          <span style={{ color: "#e53935" }}> ❌  {req_food.toFixed(2)}</span>
        ) : (
          <span style={{ color: "#4caf50" }}> ✅  You got real stock.</span>
        )}
      </span>
    );
  };

  useEffect(() => {
    fetch(USER_ACCOUNT_DETAILS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "farmersworld",
        index_position: 1,
        json: true,
        key_type: "i64",
        limit: 100,
        lower_bound: account,
        reverse: false,
        scope: "farmersworld",
        show_payer: false,
        table: "accounts",
        table_key: "",
        upper_bound: account,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let token_balances = {};
        json.rows[0].balances.forEach((token) => {
          token_balances[token.split(" ")[1]] = Number(token.split(" ")[0]);
        });
        const energy = json.rows[0].energy;
        const max_energy = json.rows[0].max_energy;
        setUserAccountDetails({
          token_balances,
          energy,
          max_energy,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });

    fetch(CROPS_DETAILS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "farmersworld",
        index_position: 2,
        json: true,
        key_type: "i64",
        limit: 100,
        lower_bound: account,
        reverse: false,
        scope: "farmersworld",
        show_payer: false,
        table: "crops",
        table_key: "",
        upper_bound: account,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let tempCrops = [];
        json.rows.forEach((crop) => {
          //   Find Data
          let foundCropTemplate = _.findWhere(FW_TEMPLATES, {
            template_id: crop["template_id"],
          });

          //   Prepare data
          let template_name = foundCropTemplate.template_name;
          let src = foundCropTemplate.src;

          let dt;
          dt = new Date(new Date(crop.next_availability * 1000));

          let nxt_avlbl = dt - new Date();
          let nextClickTime = "00:00:00";
          if (nxt_avlbl > 0) {
            nextClickTime = new Date(nxt_avlbl).toISOString().substr(11, 8);
          }
          let dangerTimer = false;
          let timerSplit = nextClickTime.split(":");
          if (
            timerSplit[0] === "00" &&
            timerSplit[1] === "00" &&
            Number(timerSplit[2]) <= 30
          ) {
            dangerTimer = true;
            updateCropTimeOut(true);
          }

          //   Merge Data
          let newData = {
            ...crop,
            template_name,
            src,
            nextClickTime,
            dangerTimer,
          };
          tempCrops.push(newData);
        });
        updateCropsCalcDetails(tempCrops);
        setCropsDetails(tempCrops);
        setCropsLoaded(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [cropsLoaded, isButtonClicked]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 2 }}>
        <div style={{}}>
          <Grid container style={{ justifyContent: "space-evenly" }}>
            {cropsDetails.map((crop, index) => {
              return (
                <Grid
                  className="toolItem"
                  item
                  // xs={'50%'}
                  style={{ margin: 5, justifyContent: "space-around" }}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      columnGap: 10,
                    }}
                  >
                    <Avatar
                      className={`avatarCircle woodAvatarCircle`}
                      style={{}}
                      alt={crop.template_name}
                      src={require(`../assets/images/${crop.src}`)}
                    ></Avatar>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 6,
                        alignItems: "flex-start",
                        flex: 1,
                      }}
                    >
                      <div
                        className="tools woodTools"
                        style={{ marginLeft: "auto" }}
                      >
                        {crop.template_name}
                      </div>
                      <Fab
                        variant="extended"
                        size="small"
                        className={`toolTimer fabText ${
                          crop.dangerTimer ? "dangerToolTimer" : "safeToolTimer"
                        }`}
                        style={{ marginBottom: 3, alignSelf: "end" }}
                        aria-label="energy"
                      >
                        {crop.nextClickTime}
                      </Fab>
                      <Fab
                        variant="extended"
                        size="small"
                        className="durabilityBadge fabText"
                        style={{ marginBottom: 3, alignSelf: "end" }}
                        aria-label="claims"
                      >
                        {`${crop["times_claimed"]}/${TOTAL_CLAIMS_PER_SEED}`}
                      </Fab>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div>
          <label>Crops calculation:</label>
        </div>
        <div className="cropsDetails" style={{ textAlign: "left" }}>
          <p>
            Number of Seeds: <span>{0 || cropsDetails.length}</span>
          </p>
          <p>
            Types of Seed: <span>{cropsCalcDetails.seeds}</span>
          </p>
          {/* <p>Total Claims/seed: {cropsCalcDetails.total_claims_per_seed}</p> */}
          {/* <p>
            Total Completed Claims: {cropsCalcDetails.total_claims_completed}
          </p> */}
          <p>
            Remaining Claims: <span>{cropsCalcDetails.remaining_claims}</span>
          </p>
          {/* <p>Available Food: {userAccountDetails.token_balances?.FOOD}</p> */}
          {/* <p>Available Energy: {userAccountDetails.energy}</p> */}
          <p>
            Required Food:
            <span>{getRequiredFood()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
