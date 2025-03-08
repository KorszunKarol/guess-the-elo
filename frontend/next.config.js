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
      perf_hooks: false,
      fs: false,
      worker_threads: false,
      path: false
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
            from: 'node_modules/stockfish/src/stockfish-nnue-16.js',
            to: path.resolve(__dirname, 'public/wasm/stockfish-nnue-16.js'),
            transform(content) {
              return content.toString().replace(/require\(['"]perf_hooks['"]\)/g, '{}');
            }
          },
          {
            from: 'node_modules/stockfish/src/stockfish-nnue-16-single.js',
            to: path.resolve(__dirname, 'public/wasm/stockfish-nnue-16-single.js'),
            transform(content) {
              return content.toString().replace(/require\(['"]perf_hooks['"]\)/g, '{}');
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
        // Apply to all routes
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
        ]
      },
      // Specific headers for WASM files
      {
        source: '/wasm/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      // Specific headers for JS files
      {
        source: '/wasm/:path*.js',
        headers: [
          { key: 'Content-Type', value: 'text/javascript' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
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