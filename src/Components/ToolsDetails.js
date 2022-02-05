import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import _ from "underscore";
import "../styles/style.css";
import { getMemberships, getTools } from "../actions/services";

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

export default ({
  isButtonClicked,
  updateToolTimeOut,
  account,
  stop,
  updateIsMining,
}) => {
  const [dense] = React.useState(false);
  const [toolsDetails, setToolsDetails] = useState([]);
  const [toolsLoaded, setToolsLoaded] = useState(false);

  useEffect(() => {
    getMemberships(account)
      .then((membsData) => {
        // uWM =
        // console.log(membsData);
        // console.log(woodMembs);
        membsData.forEach((mem) => {
          // console.log(mem.template_id);
          const foundMemb = woodMembs.filter(
            (memTemplate) => memTemplate.template_id === mem.template_id
          )[0];
          if (foundMemb) {
            console.log(foundMemb);
          }
        });

        // console.log(woodBronzeTemplate);
        // console.log(woodSilverTemplate);

        let membershipAvailable = [
          {
            type: "WOOD",
            tiers: {
              BRONZE: 1,
              SILVER: 2,
              GOLD: 4,
            },
          },
          {
            type: "FOOD",
            tiers: {
              BRONZE: 1,
              SILVER: 2,
              GOLD: 4,
            },
          },
          {
            type: "GOLD",
            tiers: {
              BRONZE: 1,
              SILVER: 2,
              GOLD: 4,
            },
          },
        ];

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
              let woodMembership = true;
              let dt;
              if (woodMembership && tool.type.toLowerCase() === "wood") {
                dt = new Date(
                  new Date(tool.next_availability * 1000).setHours(
                    new Date(tool.next_availability * 1000).getHours() + 4
                  )
                );
              } else {
                dt = new Date(new Date(tool.next_availability * 1000));
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
        console.log(error.message);
      });
  }, [toolsLoaded, isButtonClicked]);

  return (
    <div>
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
                src={require(`../assets/images/${tool.src}`)}
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
