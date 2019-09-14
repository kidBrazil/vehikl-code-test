// Black Mesa - Webpack Boilerplate[VueJS]
// Webpack 4 Configuration file
// author: Lucas Moreira <hello@lucasmoreira.dev>
// -----------------------------------------
// PRODUCTION ENVIRONMENT
// ----------------------------------------

// Require Imports
var webpack = require('webpack');
var path = require('path')

// Webpack Merge Configuration
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require("compression-webpack-plugin");

// Robotos Automation
const RobotstxtPlugin = require("robotstxt-webpack-plugin").default;
// Favicon Automation
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Minification & Optimization
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// SPA Prerenderer
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
// Sitemap Generator
const SitemapPlugin = require('sitemap-webpack-plugin').default;
// WebP Processing
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')

// WebP Image Processing Options
const webpOptions =  {
  config: [{
    test: /\.(jpe?g|png)/,
    options: {
      quality:  100,
      lossless: true
    }
  }],
  overrideExtension: false,
  detailedLogs: false,
  strict: true
}

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

// SEO & Sitemap Configuration
const hostDomainUrl = "http://vehikl-code-test.s3-website-us-east-1.amazonaws.com/"
const sitemapFile = hostDomainUrl + "/sitemap.xml"
// [ Robots.TXT Configuration ]
// Fully automated robots.txt generation based on policy listed
// below. Remember to disalow bots during staging and enable for
// prod environment.
// TODO - Update robots.txt for Staging & Production
// While dev is being done switch to NO CRAWL
const robotOptions = {
  policy: [
    {
      userAgent: "Googlebot",
      allow: "/",
      crawlDelay: 2
    },
    {
      userAgent: "*",
      allow: "/",
      crawlDelay: 10,
    }
  ],
  // Configured on SEO &Sitemap Configuration
  sitemap: sitemapFile,
  host: hostDomainUrl
}

// Prerenderer Routes - TODO - Update according to present routes
// These tell the prerenreder which routes to render..
// These should match routes.js
const prerenderRoutes = [
  '/'
]

// Production Environment Exports
module.exports = merge(common, {
  // Set Webpack Mode
  mode: 'production',
  // Plugins & Post Processing
  plugins: [
    // Clean ./dist Folder
    new CleanWebpackPlugin('dist', {} ),
    // Generate Robots.TXT
    new RobotstxtPlugin(robotOptions),
    // Set NODE_ENV to Production
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: true,},
        reduceIdents: false,
        discardDuplicates: false,
        autoprefixer: false
      },
      canPrint: true
    }),
    // Process and Inject Favicon
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/favicon.png', // Source for Favicon file
      prefix: 'icons-[hash]/', // File Prefix
      emitStats: false,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      inject: true, // Inject Calls on index.html automatically
      // CHANGE COLOR OF THEME - TODO
      background: '#f06404',
      // CHANGE PROJECT TITLE - TODO
      title: 'Parking Lot Manager | Client - Code Test',
      // Icons to export
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new ImageminWebpWebpackPlugin(webpOptions),
    // [ PRERENDERER ]--------------------------------
    // The prerenderer is the solution for the SEO problem
    // encountered by all SPAs. This plugin will run through the
    // routes present on the renderedRoutes array and generate a
    // plain HTML file. When crawlers hit the site, they will see
    // these HTML files and index the information
    //
    // CAVEATS --
    // Some plugins and scripts will cause issues and must be prevented
    // from running on the prerenderer
    //
    // __PRERENDER_INJECTED  -----
    // We can control script execution on the application by looking for
    // the window.__PRERENDER_INJECTED property. This property will be either
    // undefined or true. True value indicates you are in the pupeteeer
    // prerender environment. Adjust scripts accordingly
    //
    // postProcess() -----
    // this function is used to remove active classes from the body of the HTML
    // to prevent flashes of content during initial load. We want the vue instance
    // to take care of placing those classes when needed.
    //
    // SNAPSHOT ----
    // This plugin takes a snapshot of the HTML when it sees a trigger event. In
    // our configuration the prerenderer is looking for the following event:
    //
    // document.dispatchEvent(new Event('spa-rendered'));
    //
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      // Routes to render
      routes: prerenderRoutes,
      // Export & Optimization options
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true
      },
      // Process page before output..
      postProcess(renderedRoute) {
        // Remove active classes from prerendered routes
        renderedRoute.html = renderedRoute.html

        return renderedRoute;
      },
      // Renderer Options
      renderer: new Renderer({
        // Inject window property
        injectProperty: '__PRERENDER_INJECTED',
        inject: {
          stopScripts: true
        },
        headless: true,
        // Triggered by App.Vue
        renderAfterDocumentEvent: 'spa-rendered'
        //renderAfterTime: 10000
      })
    }),
    // [ Sitemap Generation ]
    // Also to aid with SEO and automation this plugin will generate
    // a full XML sitemap based on the routes given to the prerenderer.
    new SitemapPlugin(hostDomainUrl, prerenderRoutes, {
      changeFreq: 'monthly',
      lastMod: true,
      priority: '0.4',
      skipGzip: true,
    }),
    // Gzip Compression
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});
