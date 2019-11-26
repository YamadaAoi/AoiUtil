const path = require("path");

const aoiUtilPath = require("./aoiUtilPath.json");
let entry = {};
aoiUtilPath.forEach(obj => {
  entry[obj.name] = path.join(__dirname, obj.path);
});

module.exports = {
  mode: "production",
  entry,
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    path: path.join(__dirname, "../lib"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.join(__dirname, "../src"),
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "../tsconfig.json"),
            },
          },
          {
            loader: "tslint-loader",
            options: {
              configFile: path.resolve(__dirname, "../tslint.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
