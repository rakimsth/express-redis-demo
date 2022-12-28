var express = require("express");
var router = express.Router();
const axios = require("axios");
var db = require("../dbconfig");

function composeResponse(username, repos, cached) {
  return {
    username,
    repos,
    cached,
  };
}

const cacheMiddleware = async (req, res, next) => {
  const { username } = req.params;
  console.log({ username });
  const data = await db.get(username);
  if (data !== null) {
    res.json(composeResponse(username, data, true));
  } else {
    console.log("data not found in cache");
    next();
  }
};

const getResponse = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { data } = await axios(`https://api.github.com/users/${username}`);
    console.log({ data: data.public_repos });
    const repos = data.public_repos;

    if (!isNaN(repos)) {
      db.set(username, repos);
      res.json(composeResponse(username, repos, false));
    } else {
      res.status(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

/* GET home page. */
router.get("/:username", cacheMiddleware, getResponse);

module.exports = router;
