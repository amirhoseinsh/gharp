import { config } from "@remotion/eslint-config-flat";

export default {
  ...config,
  env: {
    // Merge existing environment settings with Node
    ...config.env,
    node: true,
  },
};
