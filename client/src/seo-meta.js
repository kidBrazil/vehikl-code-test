// Black Mesa Site SEO
// Flat File JSON Object for easy SEO implementation

// Staging Build Flag -------------------------------
// This flag will tell the compiler wether you are working on
// staging or live. If the variable is True it means you are on
// staging build.
//
// This will affect which one of the URL's the builder will append
// to the social media images and the og:url attribute.
//
// This will allow for the staging branch to be tested on
// Facbeook / Twitter debugger panels.
//
// TODO -- Change stagingBuild to FALSE before live deploy.
let stagingBuild = true;

// Template INFO - Dictates slug for title and site URL's
let template = {
  slug: '%s | Parking Lot Manager | Client - Code Test',
  slugAddon: ' | Parking Lot Manager | Client - Code Test',
  stageUrl: 'http://vehikl-code-test.s3-website-us-east-1.amazonaws.com/',
  liveUrl: 'http://vehikl-code-test.s3-website-us-east-1.amazonaws.com/',
};

// Social Media configuration
let social = {
  appid: 'XXXXXX',
  ogtype: 'website',
  cardtype: 'summary_large_image',
  twsite: '@Nothinghere',
  ogimage: 'social/facebook.jpg',
  twimage: 'social/twitter.png'
};

// General Site Wide SEO
let general = {
  title: 'Parking Lot Manager | Client - Code Test',
  desc: 'Parking Lot Manager App as a code test.'
};

// Page Specific SEO SAMPLE.
// let myPage = {
//   ogimage: 'myImagePathHere.png',
//   twimage: 'myImagePathHereForTwitter.png',
//   title: 'My Page Title',
//   desc: 'My Page Description'
// }
//
// Don't forget to add it to the EXPORT below.

// Export Objects - Add objects as needed
export {
  stagingBuild,
  template,
  social,
  general
};
