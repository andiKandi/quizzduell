const { resolve } = require("path");
const prefix = (path) => {
  let prefix;
  switch (process.env.NODE_ENV) {
    // ts-jest registers ts-node
    case "test":
      prefix = "src";
      break;
    // development uses tsc-watch now
    case "development":
    case "production":
    default:
      prefix = "dist/src";
      break;
  }

  return `${prefix}/${path}`;
};

const config = {
  type: "mysql",
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE,
  synchronize: false,
  logging: false,
  entities: [resolve(__dirname, "dist/entity/*.js")],
  migrations: ["dist/migration/*"],
  subscribers: [prefix("{subscriber,domain,projection}/**/*.*")],
  cli: {
    entitiesDir: prefix("{entity,domain,projection}"),
    migrationsDir: prefix("migration"),
    subscribersDir: prefix("{subscriber,domain,projection}"),
  },
};
module.exports = config;
