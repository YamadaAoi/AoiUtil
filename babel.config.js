module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        modules: "umd",
        targets: {
          browsers: ["> 1%", "last 4 versions", "not ie <= 8"],
        },
      },
    ],
  ];
  const plugins = [["@babel/plugin-transform-runtime", { corejs: 2 }]];
  return {
    presets,
    plugins,
  };
};
