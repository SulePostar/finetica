module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: 'current' }
            }
        ]
    ],
    plugins: [
        // transform dynamic import() to require() in server builds
        'dynamic-import-node'
    ]
};
