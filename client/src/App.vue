<template lang="pug">
  main(id="app")
    //- Transition Wrapper
    transition(name="fade")
      //- Router View
      router-view
</template>

<script>
// Import SEO From File
import { stagingBuild, template, social, general }       from './seo-meta.js';

export default {
  name: 'App',

  data: function(){
    return {
      cookies: false,
      showCookies: false
   };
  },
  // Meta SEO Function
  metaInfo() {
    return {
      title: general.title,
      titleTemplate: template.slug,
      link: [
        // Alertiry
        { rel: 'stylesheet', href: 'https://mdevcdn.digital/alerts/alertify.css' }
      ],
      script: [
        // Alertify
        { src: 'https://mdevcdn.digital/alerts/alertify.js', async: true, defer: true },
      ],
      meta: [
         //SEO
        { vmid: 'desc', name: 'description', content: general.desc },
        { vmid: 'ogurl', property: 'og:url', content: (stagingBuild ? template.stageUrl : template.liveUrl) },
        { vmid: 'ogappid', property: 'fb:app_id', content: social.appid },
        { vmid: 'ogtype', property: 'og:type', content: social.ogtype },
        { vmid: 'ogtitle', property: 'og:title', content: general.title + template.slugAddon },
        { vmid: 'ogimage', property: 'og:image', content: (stagingBuild ? template.stageUrl : template.liveUrl) + this.loadImage(social.ogimage) },
        { vmid: 'ogdesc', property: 'og:description', content: general.desc },
        { vmid: 'twcard', name: 'twitter:card', content: social.cardtype },
        { vmid: 'twtitle', name: 'twitter:title', content:  general.title + template.slugAddon },
        { vmid: 'twimage', name: 'twitter:image', content: (stagingBuild ? template.stageUrl : template.liveUrl) + this.loadImage(social.twimage) },
        { vmid: 'twdesc', name: 'twitter:description', content: general.desc }
      ]
    };
  },

  mounted: function(){
    // Wait for full load and next tic on VM
    this.$nextTick(() => {
      // [ PRERENDER SNAPSHOT ] ------------------------
      // Dispatches event to tell the prerenderer to take snapshot
      if (window.__PRERENDER_INJECTED) {
        document.dispatchEvent(new Event('spa-rendered'));
      }

      // [ FANCY CONSOLE OUTPUT ] --------------------------
      // each %c allows you to create a styling block
      // style each block in order below it
      if ( navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ) {
        window.console.log.apply(console, [
          "\n %c Made with SASS by Lucas Moreira 😜",
          "color: #fff; background: #f06404; ;font-family: sans-serif; text-transform: uppercase; font-size: 225%; font-weight: 700; padding:10px; border-radius: 20px 0 20px 0;"
        ]);
        window.console.log.apply(console, [
        ]);
      }
      // Output standard message for other browsers
      else {
        console.log('Made by Lucas Moreira 😜');
      }
    });
  },

  updated: function() {
    // [ PRERENDER SNAPSHOT ] ------------------------
    // Dispatches event to tell the prerenderer to take snapshot
    if (window.__PRERENDER_INJECTED) {
      document.dispatchEvent(new Event('spa-rendered'));
    }
  },

  methods: {
    skipNav() {
      this.scrollToHash('#mainContent', 50);
    }
  }
};
</script>

<style lang="scss">

/*--------------------------------------*/
/* Lean Import for Components           */
/*--------------------------------------*/
/* Disable because they are already linted */
/* stylelint-disable */
@import './assets/styles/global-main.scss';
/* stylelint-enable */


/*--------------------------------------*/
/* Main Component Styles                */
/*--------------------------------------*/

.fade-enter {
  transition: 1.4s opacity 1.8s;
}

.fade-leave-to {
  transition: opacity 1.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
}

.fade-leave-active {
  opacity: 0;
  position: absolute;
}

.blk-skipnav {
  display: block;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate3d(-50%, -200%, 0);
  background: transparent;
  text-transform: uppercase;
  color: $color-brand-primary;
  border: 2px solid $color-brand-primary;
  padding: 15px 20px;
  transition: all .8s;
  z-index: 999;
  font-size: 1.5vw;
  opacity: 0;

  &:focus {
    opacity: 1;
    color: $white;
    background: $color-brand-primary;
    transform: translate3d(-50%, 0, 0);
  }
}


// Scrollbar Styling ( Webkit Only )
/* Disabled to use hacks.. */
/* stylelint-disable */

// Scrollbar Width
body::-webkit-scrollbar {
  width: 1vw;
}

// Background of Scrollbar
body::-webkit-scrollbar-track {
  background: lighten($color-brand-bkg, 10%);
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}

// Scroll Thumb ( Part that moves )
body::-webkit-scrollbar-thumb {
  background-color: lighten($color-brand-primary, 10%);
  outline: 4px solid darken($color-brand-bkg, 10%);
}


::selection {
  background: $color-brand-accent;
}
::-moz-selection {
  background: $color-brand-accent;
}

h1.u-c-primary::selection,
h2.u-c-primary::selection,
h3.u-c-primary::selection,
h4.u-c-primary::selection {
  background: $color-brand-bkg;
}
h1.u-c-primary::-moz-selection,
h2.u-c-primary::-moz-selection,
h3.u-c-primary::-moz-selection,
h4.u-c-primary::-moz-selection {
  background: $color-brand-bkg;
}

/* stylelint-enable */
</style>
