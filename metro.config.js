// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");
defaultConfig.resolver.unstable_enablePackageExports = true;

// Configuração de path aliases para React Native
const projectRoot = __dirname;
const watchFolders = [
  path.resolve(projectRoot, 'src'),
  path.resolve(projectRoot, 'assets'),
];

defaultConfig.projectRoot = projectRoot;
defaultConfig.watchFolders = watchFolders;

// Resolver config para path aliases
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

module.exports = defaultConfig;
