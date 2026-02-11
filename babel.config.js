module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    path: '.env',
                    blacklist: null,
                    whitelist: null,
                    safe: false,
                    allowUndefined: true,
                },
            ],
            [
                'module-resolver',
                {
                    alias: {
                        '@assets': './assets',
                        '@core': './src/core',
                        '@presentation': './src/presentation',
                        '@domain': './src/domain',
                        '@data': './src/data',
                        '@shared': './src/shared',
                    },
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
            ],
        ],
    };
};
