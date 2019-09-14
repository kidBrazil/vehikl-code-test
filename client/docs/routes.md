# :steam_locomotive:Routing [ SPA ] - vue-router
This document describes the routing scheme being used in this project. This is all based on the vue-router dependency and you can find more information on it on their [Documentation Page](https://github.com/vuejs/vue-router "vue-router Documentation").

## Setup
Router setup is simple. It requires a couple of configurations to be set on main.js

Check out the vue router documentation on [History Mode](https://router.vuejs.org/en/essentials/history-mode.html "History Mode Server Setup")

```javascript
//main.js

// Import vue-router..
import VueRouter from 'vue-router';
// Import Routes
import { routes  } from './routes.js'

// Tell Vue to use vue-router..
Vue.use(VueRouter);

// Setup Router...

const router = newVueRouter ({
  // Register Route object from routes.js
  routes,
  // Use History Mode to remove '#' from URL
  // Server must be configured to serve index.html on all requests.
  mode: 'history',
  // Control scrolling for anchor tag navigation
  scrollBehavior( to, from, savedPosition  ){
    //Return position for scrolling with {x: 0, y:0}

    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
});

//Route Guarding - Check ingress global...
router.beforeEach((to, from, next) => {
  //Gets executed on all routes..
  //keep generic...
  console.log('logged route..')

  //next() will allow the request to continue.
  //you may also pass false to next to abord.
  next();
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
```

##Routes.js
Outsourced routing table.

```javascript
//routes.js

//Import parent template components
import Home from './component/home.vue'
import LoggedIn from './component/logged-in.vue'

//Lazy Load Routes...
//The appended argument 'user' will group these into the same bundle for lazy loading.
const User = resolve => {
  require.ensure(['./component/user.vue'], () => {
    resolve( require('./component/user.vue'));
  }, 'user');
};

const UserProfile = resolve => {
  require.ensure(['./component/user-profile.vue'], () => {
    resolve( require('./component/user-profile.vue')  );
  }, 'user');
};

const UserEdit = resolve => {
  require.ensure(['./component/user-edit.vue'], () => {
    resolve( require('./component/user-edit.vue')  );
  }, 'user');
};
// Export Constant...
export const routes =[

  // Route...
  {
    path: '', component: Home
  },
  // Guarded Routes...
  {
    path: '/loggedin/:id', component: LoggedIn,
    // BeforeEnter() Route Guard...
    beforeEnter: ( to, from, mext  ) => {
      //check if user is authenticated for example..
      if (loggedIn) {
        // Go ahead and continue...
        next();
      }
      else {
        //Prevent routing..
        next(false);
      }

    }
  },
  // Child Routes...
  {
    path: '/user', component: User, children: [
      {
        // resolves to /user/:id/profile/
        path: ':id/profile', component: UserProfile, name: 'userProfile'
      },
      {
        // resolves to /user/:id/profile/edit
        path: ':id/profile/edit', component: UserEdit, name: 'userEdit'
      },
      {
        // Path Redirection...
        path: '/redirect',
        redirect: '/user'
      },
      {
        //Catch All Other input routes...
        path: *,
        redirect: '/'
      }

    ]}
  },
];

// Dynamic Routed Link.
<router-link
  tag="button"
  //to bound to named route.
  :to="{
    name: 'userEdit',
    params: { id: $route.params.id  },
    query: {
      locale: 'en',
      q: 100
    },
    // Passing Hash for anchor links and scrolling.
    hash: '#desired-target-id'
  }"
  class="primary">Edit User</router-linki>

```

##Template
To use the router you must set a router-view element so that Vue knows where to render the change.

```javascript
<script>
  // Command Based navigatio
  export default {
    data() {
      return {
        // Extract URI Parameters
        id: this.$route.params.id
      }
    },
    // Use Watch functions to react to state changes in URI
    watch: {
      // Watch for updates on route.
      '$route'(to, from){
        // This.id maps to params.id
        this.id = to.params.id;
      }
    }
    methods: {
      navigateToHome() {
        //Push navigation into the stack array.
        this.$router.push('/');
      }
    }
  }
</script>
<template>
  <div>
    <ul>
      // Use Router Link instead of A for route based SPA navigation.
      <li><router-link to ="/" active-link="active-class"></router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>
```

##Named Router VIews
You may also use named router views to keep the routing separate in instances with multiple interactive menus/sections.

```html
// Named Router View.
<router-view> name="named-view"></router-view>

//Main.js...

//Adding Components object to specify named view components for router view.

{
  path: '', name: 'named', components: {
    //List of named router views to mount on..
    default: Home,
    'named-view': NamedVIew
  }
}
```
