const path = require("path");

module.exports = {
  // other configurations
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages"),
      "@page-paths": path.resolve(__dirname, "src/routes/page-paths.ts"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@helpers": path.resolve(__dirname, "src/helpers"),
      "@interfaces-types": path.resolve(__dirname, "src/interfaces-types"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@responses": path.resolve(__dirname, "src/responses"),
      "@scss": path.resolve(__dirname, "src/resources/scss"),
      "@components": path.resolve(__dirname, "src/components"),
      "@images": path.resolve(__dirname, "src/resources/images"),
    },
  },
};
