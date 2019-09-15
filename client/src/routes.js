// Import Parent Compontents
import ErrorPage            from './components/parent-templates/error_404.vue';
import Home                 from './components/home/home.vue';
// Auth Components
import AuthComponent from './components/auth/Authentication.vue';
import LoginComponent from './components/auth/Login.vue';
import RegisterComponent from './components/auth/Register.vue';
import ResetComponent from './components/auth/Reset.vue';

// Export routes as named constant array.
// Routes consist of desired path + bound parent component
export const routes = [
  {
    path: '',
    component: Home
  }
  // {
  //   path:'/auth',
  //   component: AuthComponent,
  //   redirect: '/auth/login',
  //   children: [
  //     {
  //       path: "login",
  //       component: LoginComponent
  //     },
  //     {
  //       path: "register",
  //       component: RegisterComponent
  //     },
  //     {
  //       path: "reset",
  //       component: ResetComponent
  //     }
  //   ]
  // }
];
