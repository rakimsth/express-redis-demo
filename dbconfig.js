const redis = require("redis");
const EXPIRY_TIME_IN_SECONDS = 60 * 60;
const client = redis.createClient({
  port: "6379",
  host: "localhost",
  // password  : 'redispassword',
});

client.connect().catch(console.error);

client.on("connect", function () {
  console.log("Redis Database connected" + "\n");
});

client.on("reconnecting", function () {
  console.log("Redis client reconnecting");
});

client.on("ready", function () {
  console.log("Redis client is ready");
});

client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

client.on("end", function () {
  console.log("\nRedis client disconnected");
  console.log("Server is going down now...");
  process.exit();
});

module.exports.set = (key, value) => {
  client.set(key, value, redis.print);
  return "done";
};

module.exports.hset = (key, field, value) => {
  client.hSet(key, field, value);
  client.expire(key, EXPIRY_TIME_IN_SECONDS);
  return "done";
};

module.exports.get = (key) => {
  return client.get(key);
};

module.exports.hgetAll = (key) => {
  return client.HGETALL(key);
};

module.exports.close = () => {
  client.quit();
};
