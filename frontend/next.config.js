const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  serverExternalPackages: ['stockfish'],
  outputFileTracingIncludes: {
    '**/*.wasm': ['./node_modules/stockfish/src/*.wasm'],
    '/api/analysis': ['./node_modules/stockfish/src/*.wasm']
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // Remove existing WASM rule if any
    config.module.rules = config.module.rules.filter(
      rule => !rule.test?.toString().includes('.wasm')
    );

    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
        },
      },
    });

    config.output.assetModuleFilename = `static/[hash][ext]`;
    config.output.publicPath = '/_next/';

    config.externals = config.externals || [];
    config.externals.push(function({ context, request }, callback) {
      if (/^(readline|fs|worker_threads)$/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      readline: false,
      worker_threads: false
    };

    // Create public directory if it doesn't exist
    const fs = require('fs');
    const publicWasmDir = path.resolve(__dirname, 'public/wasm');
    if (!fs.existsSync(publicWasmDir)) {
      fs.mkdirSync(publicWasmDir, { recursive: true });
    }

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/stockfish/src/*.{wasm,nnue}',
            to: path.resolve(__dirname, 'public/wasm/[name][ext]'),
            force: true
          },
          {
            from: 'node_modules/stockfish/src/stockfish-nnue-16-single.js',
            to: path.resolve(__dirname, 'public/wasm/stockfish-nnue-16-single.js'),
            transform(content) {
              return `// ${new Date().toISOString()}\n${content}`
            }
          }
        ],
        options: {
          concurrency: 1
        }
      })
    );

    return config;
  },
  async headers() {
    return [
      {
        source: '/wasm/stockfish-nnue-16-single.js',
        headers: [
          { key: 'Content-Type', value: 'text/javascript' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
        ]
      },
      {
        source: '/wasm/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' }
        ]
      }
    ]
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  experimental: {
    outputFileTracingIncludes: {
      '/api/analysis': ['./node_modules/stockfish/src/*.wasm']
    }
  }
}