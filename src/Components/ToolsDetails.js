import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Stack } from "@mui/material";
import Fab from "@mui/material/Fab";
import _ from "underscore";
import "../styles/style.css";
import { getMemberships, getTools } from "../Actions/services";

import FW_TEMPLATES from "../Utils/Templates";
// WOOD MEMBERSHIPS
const woodBronzeTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260628,
});
const woodSilverTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260629,
});
const woodGoldTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260631,
});
const woodDiamondTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260635,
});
const woodMembs = [
  woodBronzeTemplate,
  woodSilverTemplate,
  woodGoldTemplate,
  woodDiamondTemplate,
];

// FOOD MEMBERSHIPS
const foodBronzeTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260636,
});
const foodSilverTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260638,
});
const foodGoldTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260639,
});
const foodDiamondTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260641,
});

const foodMembs = [
  foodBronzeTemplate,
  foodSilverTemplate,
  foodGoldTemplate,
  foodDiamondTemplate,
];

// GOLD MEMBERSHIPS
const goldBronzeTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260642,
});
const goldSilverTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260644,
});
const goldGoldTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260647,
});
const goldDiamondTemplate = _.findWhere(FW_TEMPLATES, {
  template_id: 260648,
});

const goldMembs = [
  goldBronzeTemplate,
  goldSilverTemplate,
  goldGoldTemplate,
  goldDiamondTemplate,
];

const ToolsDetails = ({
  isButtonClicked,
  updateToolTimeOut,
  account,
  stop,
  updateIsMining,
  isCurrentUserUpdateRequested,
}) => {
  const [dense] = React.useState(false);
  const [toolsDetails, setToolsDetails] = useState([]);
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    getMemberships(account)
      .then((membsData) => {
        let membershipData = [
          {
            type: "WOOD",
            tiers: {
              BRONZE: 0,
              SILVER: 0,
              GOLD: 0,
            },
          },
          {
            type: "FOOD",
            tiers: {
              BRONZE: 0,
              SILVER: 0,
              GOLD: 0,
            },
          },
          {
            type: "GOLD",
            tiers: {
              BRONZE: 0,
              SILVER: 0,
              GOLD: 0,
            },
          },
        ];

        membsData.forEach((mem) => {
          // console.log(mem.template_id);
          const foundWoodMemb = woodMembs.filter(
            (memTemplate) => memTemplate.template_id === mem.template_id
          )[0];
          const foundFoodMemb = foodMembs.filter(
            (memTemplate) => memTemplate.template_id === mem.template_id
          )[0];
          const foundGoldMemb = goldMembs.filter(
            (memTemplate) => memTemplate.template_id === mem.template_id
          )[0];
          if (foundWoodMemb || foundFoodMemb || foundGoldMemb) {
            membershipData.map((membership) => {
              if (membership.type === foundWoodMemb?.type) {
                membership.tiers[
                  foundWoodMemb.template_name.split(" ")[0].toUpperCase()
                ] += 1;
              } else if (membership.type === foundFoodMemb?.type) {
                membership.tiers[
                  foundFoodMemb.template_name.split(" ")[0].toUpperCase()
                ] += 1;
              } else if (membership.type === foundGoldMemb?.type) {
                membership.tiers[
                  foundGoldMemb.template_name.split(" ")[0].toUpperCase()
                ] += 1;
              }
              return 1;
            });
          }
          setMemberships(membershipData);
        });

        getTools(account)
          .then((toolsData) => {
            let tempTools = [];
            if (toolsData.length > 0) {
              updateIsMining(true);
            } else updateIsMining(false);
            toolsData.forEach((tool) => {
              //   Find Data
              let foundToolTemplate = _.findWhere(FW_TEMPLATES, {
                template_id: tool["template_id"],
              });

              //   Prepare data
              let template_name = foundToolTemplate.template_name;
              let src = foundToolTemplate.src;

              let available_durability = `${tool.current_durability} / ${tool.durability}`;

              // Calculate next availability
              // let next_availability = tool.next_availability * 1000 - new Date();
              let dt;
              let woodMembHours = 0;
              let foodMembHours = 0;
              let goldMembHours = 0;
              membershipData.forEach((membership) => {
                if (membership.type === "WOOD") {
                  woodMembHours +=
                    membership.tiers.BRONZE * woodBronzeTemplate.saved_claims +
                    membership.tiers.SILVER * woodSilverTemplate.saved_claims +
                    membership.tiers.GOLD * woodGoldTemplate.saved_claims;
                }
                if (membership.type === "FOOD") {
                  foodMembHours +=
                    membership.tiers.BRONZE * foodBronzeTemplate.saved_claims +
                    membership.tiers.SILVER * foodSilverTemplate.saved_claims +
                    membership.tiers.GOLD * foodGoldTemplate.saved_claims;
                }
                if (membership.type === "GOLD") {
                  goldMembHours +=
                    membership.tiers.BRONZE * goldBronzeTemplate.saved_claims +
                    membership.tiers.SILVER * goldSilverTemplate.saved_claims +
                    membership.tiers.GOLD * goldGoldTemplate.saved_claims;
                }
              });

              if (tool.type.toLowerCase() === "wood") {
                dt = new Date(
                  new Date(tool.next_availability * 1000).setHours(
                    new Date(tool.next_availability * 1000).getHours() +
                      woodMembHours
                  )
                );
              } else if (tool.type.toLowerCase() === "food") {
                dt = new Date(
                  new Date(tool.next_availability * 1000).setHours(
                    new Date(tool.next_availability * 1000).getHours() +
                      foodMembHours
                  )
                );
              } else if (tool.type.toLowerCase() === "gold") {
                dt = new Date(
                  new Date(tool.next_availability * 1000).setHours(
                    new Date(tool.next_availability * 1000).getHours() +
                      goldMembHours
                  )
                );
              }

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
                updateToolTimeOut(true);
              }

              //   Merge Data
              let newData = {
                ...tool,
                template_name,
                available_durability,
                src,
                nextClickTime,
                dangerTimer,
              };
              tempTools.push(newData);
            });
            setToolsDetails(tempTools);
            setToolsLoaded(true);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    // }, [toolsLoaded, isButtonClicked]);
  }, [toolsLoaded, isButtonClicked, isCurrentUserUpdateRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* <List
        dense={dense}
        style={{ display: "flex", flexDirection: "row", padding: 0 }}
      >
        {memberships.map((mb, index) => (
          <ListItem key={index} className="membItem">
            <Avatar
              className={`avatarCircle`}
              alt={"Hey"}
              src={require(`../Assets/images/MBS/B_F_C.png`)}
            ></Avatar>
          </ListItem>
        ))}
      </List> */}

      <List dense={dense}>
        {toolsDetails.map((tool, index) => (
          <ListItem key={index} className="toolItem">
            <ListItemAvatar>
              <Avatar
                className={`avatarCircle ${
                  tool.type.toLowerCase() === "wood"
                    ? "woodAvatarCircle"
                    : tool.type.toLowerCase() === "food"
                    ? "foodAvatarCircle"
                    : "goldAvatarCircle"
                }`}
                alt={tool.template_name}
                src={require(`../Assets/images/${tool.src}`)}
              ></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <div
                    className={`tools ${
                      tool.type.toLowerCase() === "wood"
                        ? "woodTools"
                        : tool.type.toLowerCase() === "food"
                        ? "foodTools"
                        : "goldTools"
                    }`}
                  >
                    {tool.template_name}
                  </div>
                  <Fab
                    variant="extended"
                    size="small"
                    className="durabilityBadge fabText"
                    aria-label="energy"
                  >
                    {tool["available_durability"]}
                  </Fab>
                </>
              }
              secondary=""
            />
            {/* <div>{tool.nextClickTime}</div> */}
            <Fab
              variant="extended"
              size="small"
              className={`toolTimer fabText ${
                tool.dangerTimer ? "dangerToolTimer" : "safeToolTimer"
              }`}
              aria-label="energy"
            >
              {tool.nextClickTime}
            </Fab>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ToolsDetails;
