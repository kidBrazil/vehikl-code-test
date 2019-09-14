// [ FLAT FILE DB ]
// This file is intended to serve as a flat file DB to centralize
// some of the repeated app data. This is not a substitute for a
// Dynamic DB but can work well for non-dynamic features and for
// brochure websites
//
// 1. Create variables to contain JSON objects with data.
// 2. Export the variable so it can be imported by components.
// 3. Import the JSON Objects that you need for the given component.

// Main Navigation Links
let navigation = {
  // Refer to routes.js file for available routes.
  links: [
    {
      linkName: 'Link 1',
      linkTitle: 'Link 1',
      route: '/'
    },
    {
      linkName: 'Link 2',
      linkTitle: 'Link 2',
      route: '/about'
    },
    {
      linkName: 'Link 3',
      linkTitle: 'Link 3',
      route: '/auth'
    }
  ]
};

// General App data
let generalApp = {
  homeLink: '#',
  homeTitle: 'Home',
  homeBrand: 'main-logo.png'
}

// Export named variables
export { navigation, generalApp };
