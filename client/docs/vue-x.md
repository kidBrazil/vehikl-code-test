# VueX State Management
Vue-X serves as our central state manager and storage. This allows our child components to communicate back and forth with parent components in a efficiently centralized manner. For more information on Vue-X please visit the [Official Documentation Page](https://github.com/vuejs/vuex "vue-x Documentation")

## Setup
The setup for VueX is quite simple. It requires a store.js file that imports Vue and Vue X and initializes a few containers for states. Please view the [Store.js](../vue-app-base/src/store/store.js) file for more information on the current setup.

Once we have the Store.js configured we merely need to import it via the [main.js](../vue-app-base/src/main.js) file.

```javascript
//Import Store...
import store from './store/store.js

// Render Function
new Vue({
  el: '#app',
  http: {
    root: '/root',
    headers: {
      Authorization: 'Basic YXBp0nBhc3N3b3Jk'
    }
  },
  router,
  // Add Store to the stack...
  store,
  render: h => h(App)
});
```

## Getters
Please familiarize yourself with the concept of [Getters](https://vuex.vuejs.org/en/getters.html). These should always be used to retrieve Data from the central store. Please refrain from making direct calls unless they are sparse and actually save on performance.

## Mutations
[Mutations](https://vuex.vuejs.org/en/mutations.html) are responsible for commiting state changes to the central store. These might be called directly but please consider the use of Actions if you need to do any processing to the requests as mutations must be synchronous. Actions will allow you to run Async. code or wait for requests to finish before dispatching a commit signal.

## Actions
[Actions](https://vuex.vuejs.org/en/actions.html) allow for Asynchronous code to be run prior to commits being dispatched and is the preferred method for dispatching Mutations.

## Modules
When working on this application please try to adhere to the [Module's](https://vuex.vuejs.org/en/modules.html) principles outlined in the official vue-x documents. Splitting off reusable pieces of the application into modules will make it more scalable and maintainable.

---

# Structure

## Store.js
Store.js will hold any central, global states directly on the body of the document itself. Central shared functions such as [ Getters / Actions / Mutations ] are imported to the global store object through this file as well. To keep things tidy, consider using the Modules patterns discussed above to group functionality that isn't shared and is specific to a component or section of the application.

