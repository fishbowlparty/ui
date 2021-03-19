export const CONFIG = {
  PORT: process.env.PORT || "5000",
  DATABASE_URL:
    process.env.DATABASE_URL +
    (process.env.NODE_ENV === "production" ? "?ssl=1&ssl=no-verify" : ""),
};

console.log(CONFIG.DATABASE_URL);

/**
 * Check to make sure all of our config propertes have a value.
 *
 * If there is no environment variable present and no
 * default value is provided, this will cause our program
 * to crash on startup with an infomative error message.
 */
const undefinedConfigProperties = Object.keys(CONFIG).filter(
  (property) => !CONFIG[property]
);

if (undefinedConfigProperties.length > 0) {
  console.log(
    `ERROR: the following environment variables must be set: ${undefinedConfigProperties}`
  );
  process.exit(1);
}
