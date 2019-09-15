<template lang="pug">
  //- Wrapper Container
  section.blk-main-content.u-text-center
    h1
      |Parking Lot App

    section.blk-issue-tickets
      h2
        |Issue New Tickets
      button.blk-base-btn(v-on:click="getTicket")
        |Get Ticket
      .blk-ticket(v-if="ticket")
        |Your Ticket number is {{ticket}}
</template>




<script>

//Local Component registration

// Import Axios:
import axios from 'axios';
// Import SEO From File
import { stagingBuild, template, social, general }       from '../../seo-meta.js';

export default{
  name: 'HomePage',
  // TODO - Edit meta Title

  data: function(){
    return {
      ticket: false,
    };
  },
  // Meta SEO Function
  metaInfo() {
    return {
      title: general.title,
      meta: [
        // SEO
        { vmid: 'desc', name: 'description', content: general.desc },
        { vmid: 'ogtitle', property: 'og:title', content: general.title + template.slugAddon },
        { vmid: 'ogimage', property: 'og:image', content: (stagingBuild ? template.stageUrl : template.liveUrl) + this.loadImage(social.ogimage) },
        { vmid: 'ogdesc', property: 'og:description', content: general.desc },
        { vmid: 'twtitle', name: 'twitter:title', content:  general.title + template.slugAddon },
        { vmid: 'twimage', name: 'twitter:image', content: (stagingBuild ? template.stageUrl : template.liveUrl) + this.loadImage(social.twimage) },
        { vmid: 'twdesc', name: 'twitter:description', content: general.desc }
      ]
    };
  },

  methods: {
    getTicket() {

    }
  },
};
</script>



<style lang="scss">

/*-------------------------------------*/
/* HOME Component Styles
/--------------------------------------*/


/*--------------------------------------*/

</style>
