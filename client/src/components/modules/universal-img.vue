<template>
    <picture>
      <source v-if="webpEnabled && !gif" media="screen" :srcset="loadImage(source) + '.webp'" type="image/webp">
      <source v-if="!gif" media="screen" :srcset="loadImage(source)" type="image/png">
      <img :alt="a11y" :src="loadImage(source)">
    </picture>
</template>

<script>
// [ Universal Image Component ] -------
// This component was created to give developers
// an easy way to use next-gen image formats with
// appropriate fallbacks for old browsers.
//
// This component uses the <picture> element to house 3
// different sources. WebP, Jpg and PNG. This component
// takes advantage of Webpack to generate the Webp images.
// All you need to supply to the component is the path to the
// png supplied by the designer and the Accessibility Text.
//
// Because WebPACK needs to generate webP on runtime it takes
// too long to compile for general dev practices. Therefore,
// the WebP generation only works on production/staging.
//
// To mitigate issues each time the component is mounted it checks for
// environment and disables webp when in dev mode.

export default{
  name: 'UniversalImage',

  props: [ 'source', 'a11y', 'gif' ],

  // Before mount check environment
  beforeMount () {
    // If environment is dev, disable webp.
    if ( process.env.NODE_ENV === 'development' ) {
      this.webpEnabled = false;
    }
  },

  data: function(){
    return{
      // WebP Enabled by default
      webpEnabled: true
    };
  },
};
</script>
