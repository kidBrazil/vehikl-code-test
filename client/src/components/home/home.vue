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
        |Your Ticket number is: {{ticket}}
      .blk-ticket(v-if="message")
        |{{message}}
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
      message: false,
      ticketId: null,
      ccNumber: null,
      ccSecNum: null,
      ccDate: null
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
    // Provision New Ticket!
    getTicket(e) {
      e.preventDefault();
      // Collect fields and serialize them
      axios.post('http://localhost:3000/tickets', {})
      // Success
      .then((response) => {
        console.log(response);
        // Ticket Created successfully.
        if (response.data.created) {
          // Reset message...
          this.message = false;
          this.ticket =  response.data._id;
        }
        // Ticket failed to create.
        else {
          // Reset Ticket
          this.ticket = false;
          this.message = response.data.message;
        }
      })
      // Failure
      .catch((error) => {
        console.log(error);
        alertify.error('Sorry but something went wrong with the server!');
      });
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
