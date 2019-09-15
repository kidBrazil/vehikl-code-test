<template lang="pug">
  //- Wrapper Container
  section.blk-main-content.u-text-center
    h1
      |Parking Lot App

    //- Issue New Tickets
    section.blk-issue-tickets
      h2
        |Issue New Tickets
      button.blk-base-btn(v-on:click.prevent="getTicket")
        |Get Ticket
      .blk-ticket(v-if="ticket")
        |Your Ticket number is: {{ticket}}
      .blk-ticket(v-if="message")
        |{{message}}

    //- Check Total Owed
    section.blk-check-total
      h2
        |Check Total Owed:
      .blk-input-group
        .blk-input-label
          |Enter Ticket Number:
        input(
          data-required
          class="blk-input-field"
          v-model="ticketId"
          name="Ticket Number"
          aria-required="true"
          aria-label="Enter Ticket Number"
          placeholder="Ticket #:"
          )
      button.blk-base-btn(v-on:click.prevent="getTotal")
        |Get Total

      .blk-total(v-if="total")
        |Your Total is: ${{total}}

    //- Pay Card
    section.blk-pay-total
      h2
        |Pay Ticket:

      .blk-input-group
        .blk-input-label
          |Enter Ticket Number:
        input(
          data-required
          class="blk-input-field"
          v-model="ticketId"
          name="Ticket Number"
          aria-required="true"
          aria-label="Enter Ticket Number"
          placeholder="Ticket #:"
          )

      .blk-input-group
        .blk-input-label
          |Credit Card:
        input(
          data-required
          class="blk-input-field"
          v-model="ccNumber"
          name="Ticket Number"
          aria-required="true"
          aria-label="Enter Credit Card Number"
          placeholder="Credit Card Number:"
          )

      .blk-input-group
        .blk-input-label
          |Expiry Date:
        input(
          data-required
          class="blk-input-field"
          v-model="ccDate"
          name="Ticket Number"
          aria-required="true"
          aria-label="Enter Ticket Number"
          placeholder="Expiry Date (MMYY)"
          )

      .blk-input-group
        .blk-input-label
          |CVC Number:
        input(
          data-required
          class="blk-input-field"
          v-model="ccSecNum"
          name="Ticket Number"
          aria-required="true"
          aria-label="Enter CVC Number"
          placeholder="CVC"
          )

      button.blk-base-btn(v-on:click.prevent="payTicket")
        |Pay Ticket
      .blk-paid(v-if="paid")
        |Thank you for your payment of: ${{totalPaid}}
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
      total: false,
      totalPaid: null,
      paid: false,
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
    getTicket() {
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
    },

    // Get Ticket Costs!
    getTotal() {
      // Collect fields and serialize them
      axios.get('http://localhost:3000/tickets/' + this.ticketId , {})
      // Success
      .then((response) => {
        this.total = response.data.total;
      })
      // Failure
      .catch((error) => {
        console.log(error);
        alertify.error('Sorry but something went wrong with the server!');
      });
    },

    // Get Ticket Costs!
    payTicket() {
      // Collect fields and serialize them
      axios.post('http://localhost:3000/payments/' + this.ticketId ,
      {
        "cc_number": this.ccNumber,
        "cc_expiry": this.ccDate,
        "cc_cvc": this.ccSecNum
      })
      // Success
      .then((response) => {
        console.log(response);
        this.paid = response.data.payment_fullfilled;
        this.totalPaid = response.data.payment_total;
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
