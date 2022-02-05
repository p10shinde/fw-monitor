const TOOLS_DETAILS_URL =
  "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
//   "peer.wax.alohaeos.com:9876/v1/chain/get_table_rows";

export const getMemberships = (account) =>
  new Promise((resolve, reject) => {
    fetch(TOOLS_DETAILS_URL, {
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
        table: "mbs",
        table_key: "",
        upper_bound: account,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json.rows);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

export const getTools = (account) =>
  new Promise((resolve, reject) => {
    fetch(TOOLS_DETAILS_URL, {
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
        table: "tools",
        table_key: "",
        upper_bound: account,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json.rows);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });
