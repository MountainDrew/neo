const fs          = require('fs'),
      path        = require('path'),
      processRoot = process.cwd(),
      packageJson = JSON.parse(fs.readFileSync(path.resolve(processRoot, 'package.json'), 'utf8')),
      neoPath     = packageJson.name === 'neo.mjs' ? './' : './node_modules/neo.mjs/',
      config      = require(path.resolve(neoPath, 'buildScripts/webpack/development/build.json')),
      entry       = {};

module.exports = env => {
    if (config.workers) {
        Object.entries(config.workers).forEach(([key, value]) => {
            if (key === env.worker) {
                entry[key] = path.resolve(neoPath, value.input);
            }
        });
    }

    return {
        mode: 'development',

        // see: https://webpack.js.org/configuration/devtool/
        devtool: 'inline-source-map',
        //devtool: 'cheap-module-eval-source-map',

        entry,
        target: 'webworker',

        output: {
            filename: chunkData => {
                let name = chunkData.chunk.name;

                if (config.workers.hasOwnProperty(name)) {
                    return config.workers[name].output;
                }
            },
            path: path.resolve(processRoot, 'dist/development')
        }
    }
};