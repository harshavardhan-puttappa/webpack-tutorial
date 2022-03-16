const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin'); // reduces the bundle size
const MiniCSSExtractPlugin = require('mini-css-extract-plugin'); // extracts the css into a separate file
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // cleans the output folder ( dist in our case) everytime build happens
const HtmlWebpackPlugin = require('html-webpack-plugin'); // generates index html file automatically during build

module.exports = {
  // entry point for the webpack to start build
  // entry: {'./src/index.js'}, single page application
  entry: {
    helloworld: './src/hello-world.js',
    kiwi: './src/kiwi.js',
  },

  // output folder for the bundle.js with absolute path and publicPath for static files
  output: {
    // filename: 'bundle.[contenthash].js',
    filename: '[name].[contenthash].js', // [name] is the entrypoints key
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
  },

  // mode in which the bundle is done production/development
  mode: 'production',

  // extract the common dependency libraries into a separate bundle to reduce the bundle sizes. (works on libraries more than 30kb and can be changed with minSize)
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 3000, // minimum size for extracting common depenency
    },
  },

  // rules to process the different types of resources
  // asset/resource - for images/fonts and others -> generates a file and exports url for the file
  // asset/inline - for svgs -> generates a data uri of base64 and injects into js
  // asset - general , based on size of a file selects resource/inline
  // asset/source - for text files -> generates a string from the content of the file and injects into js
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        type: 'asset',
        // condition for choosing the asset resource/inline based on file size
        parser: {
          //asset type size condition
          dataUrlCondition: {
            maxSize: 3 * 1024, // 3 kilobytes
          },
        },
      },
      // importing text files
      {
        test: /\.txt$/,
        type: 'asset/source',
      },
      // importing css files
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'], // specifies to use two loaders for importing css,scss,less files
      },
      // importing scss files
      {
        test: /\.scss$/,
        // specifies to use multiple loaders for importing css,scss,less files. Webpack executes the loaders from right to left
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      // using babel as js compiler
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // compiles ecmas 6,7,8 and others to ecmas 5
            // supports latest JS standard defined in latest ecmas specification
            presets: ['@babel/env'],
            // supports cross properties - separate plugins to be added for different features
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
      },
    ],
  },

  // Webpack plugins are the js libraries that add funtionality to the webpack and do additional thigs which loaders cannot do. Eg. change the bundle size and minify bundle.js
  plugins: [
    // new TerserPlugin(),
    new MiniCSSExtractPlugin({
      // filename: 'styles.[contenthash].css',
      filename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', path.join(process.cwd(), 'build/**/*')],
    }),
    new HtmlWebpackPlugin({
      title: 'Hello World',
      filename: 'hello-world.html',
      // meta: {
      //   description: 'Some description',
      // },
      description: 'Hello World',
      template: 'src/html-page-template.hbs', // use the handlebars template file to generate the html file,
      minify: false, // by defalut it will be true in production mode,
      chunks: ['helloworld'],
    }),
    new HtmlWebpackPlugin({
      title: 'Kiwi',
      filename: 'kiwi.html',
      description: 'Kiwi',
      template: 'src/html-page-template.hbs',
      minify: false,
      chunks: ['kiwi'],
    }),
  ],
};

// [contenthash] are used to generate the file name based on hash value
