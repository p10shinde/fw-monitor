import { endpoints } from "../Constants/Endpoints/endpoints";

localStorage.setItem("endpoints", JSON.stringify(endpoints));

let endpoint =
  JSON.parse(localStorage.getItem("endpoints"))[
    Math.floor(Math.random() * endpoints.length)
  ] || endpoints[0];

//   "peer.wax.alohaeos.com:9876/v1/chain/get_table_rows";
//   "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
const FW_ENDPOINT = `${endpoint}`;
const ALCOR_EXCHANGE = "https://wax.alcor.exchange/api/markets";
const TOKEN_BALANCES = "https://lightapi.eosamsterdam.net/api/balances/wax/";

export const getMemberships = (account) =>
  new Promise((resolve, reject) => {
    fetch(`${FW_ENDPOINT}get_table_rows`, {
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
    fetch(`${FW_ENDPOINT}get_table_rows`, {
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

export const getCrops = (account) =>
  new Promise((resolve, reject) => {
    fetch(`${FW_ENDPOINT}get_table_rows`, {
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
        resolve(json.rows);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

export const getTokenPrices = () =>
  new Promise((resolve, reject) => {
    fetch(ALCOR_EXCHANGE)
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data.filter((ent) =>
          [104, 105, 106].includes(ent.id)
        );
        let tokenPrices = { FWW: 0, FWF: 0, FWG: 0 };
        filteredData.forEach((item) => {
          if (item.id === 104)
            tokenPrices.FWW = parseFloat(addZeroes(item.last_price.toFixed(3)));
          if (item.id === 105)
            tokenPrices.FWF = parseFloat(addZeroes(item.last_price.toFixed(3)));
          if (item.id === 106)
            tokenPrices.FWG = parseFloat(addZeroes(item.last_price.toFixed(3)));
        });
        resolve(tokenPrices);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

export const getExchangeFees = () =>
  new Promise((resolve, reject) => {
    fetch(`${FW_ENDPOINT}get_table_rows`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "farmersworld",
        index_position: 1,
        json: true,
        key_type: "",
        limit: 1,
        lower_bound: "",
        reverse: false,
        scope: "farmersworld",
        show_payer: false,
        table: "config",
        table_key: "",
        upper_bound: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data.rows[0]);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

export const getAlcorTokenBalances = (account) =>
  new Promise((resolve, reject) => {
    fetch(`${TOKEN_BALANCES}${account}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data.balances.filter((bal) => bal.contract === "farmerstoken"));
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

export const getIngameTokenBalances = (account) =>
  new Promise((resolve, reject) => {
    fetch(`${FW_ENDPOINT}get_table_rows`, {
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
        upper_bound: account,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data.rows[0]);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });

function addZeroes(num) {
  const dec = num.split(".")[1];
  const len = dec && dec.length > 2 ? dec.length : 2;
  return Number(num).toFixed(len);
}
