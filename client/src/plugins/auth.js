var AuthPlugin = {
  // [ Moreira Development ] 
  // Author: Lucas Moreira
  // email: lucas@moreiradevelopment.io
  // ------------------------------------|
  // Authentication Helper Plugin
  // ------------------------------------|
  //
  // This plugin abstracts some of the 
  // common Auth functions into a single place
  // for ease of use and maintenance.

  // Save Token to Browser Local Storage
  setToken: function (token, expiration){
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expiration);
  },
  
  // Destroy Stored Token
  destroyToken: function() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
  },

  // Retrieve Token from Storage
  getToken: function (){
    var token       = localStorage.getItem('authToken');
    var expiration  = localStorage.getItem('authTokenExpiration');
      
    // If either is missing..
    if(!token || !expiration){
      return null;
    }

    // Check expiration
    if ( Date.now() > parseInt(expiration)){
      this.destroyToken();
      return null;
    }
    else {
      return token;
    }
  },
  
  // Check for valid Token.
  loggedIn: function (){
    if (this.getToken()){
      return true;
    } 
    else {
      return false;
    }
  }
};

export default function(Vue){
  Vue.auth = AuthPlugin;

  Object.defineProperties(Vue.prototype, {
    
    $auth: {
      get: function() {
        return Vue.auth;
      }
    }
  });
};
