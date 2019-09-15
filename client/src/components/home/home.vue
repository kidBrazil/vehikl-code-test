<template lang="pug">
  //- Wrapper Container
  section.blk-main-content.u-text-center
    h1.u-uppercase
      |Parking Lot App

    //- Issue New Tickets
    section.blk-section
      h3.u-uppercase
        |Issue New Tickets
      button.blk-base-btn(v-on:click.prevent="getTicket")
        |Get Ticket
      .blk-ticket(v-if="ticket")
        |TICKET NUMBER: {{ticket}}
      .blk-repsponse(v-if="message")
        |{{message}}

    //- Check Total Owed
    section.blk-section
      h3.u-uppercase
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

      .blk-repsponse(v-if="total")
        |Your Total is: ${{total}}

    //- Pay Card
    section.blk-section
      h3.u-uppercase
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
      .blk-repsponse(v-if="paid")
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
      // [ VALIDATION ] -------------------------------------------
      // Validates Ticket ID against MongoDB Object ID since that is our schema.
      let validate = /^[a-f\d]{24}$/i;
      validate = new RegExp(validate);
      // Test...
      if ( validate.test(this.ticketId) ) {
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
      }
      else {
        alertify.error('Sorry but that Ticket Number is not valid.');
      }
    },

    // Get Ticket Costs!
    payTicket() {
      // [VALIDATION] ------------------------------------------------------
      // Since CC is being validated in the backend, here we will just check
      // to make sure they are present and go from there. Typically you would
      // want some regex on the date and on the CVC before submission as well.
      if (this.ccNumber, this.ccDate, this.ccSecNum) {
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
      else {
        alertify.error('Sorry but you are missing information for payment processing.');
      }
    }
  },
};
</script>

<style lang="scss">

/*-------------------------------------*/
/* HOME Component Styles
/--------------------------------------*/
.blk-main-content {
  background: #f2f2f2;
  width: 90%;
  @include center(both);

  h1 {
    width: 100%;
    padding: 20px 0;
    color: $white;
    background: #5d5d5d;
    margin-bottom: 0;
  }

  h3 {
    width: 100%;
    padding: 10px 0;
    background: #c1c1c1;
  }
}

.blk-ticket {
  width: 50%;
  background: orange;
  margin: 25px auto 0;
  border-radius: 10px;
  font-size: 24px;
  margin-top: 25px;
  padding: 25px 10px;
  box-shadow: 5px 5px 10px rgba(0,0,0,.4);
  color: #5d5d5d;
}

.blk-section {
  width: 100%;
  padding-bottom: 20px;
}

.blk-repsponse {
  margin: 25px auto 0;
  width: 100%;
  padding: 20px 0;
  background: green;
  margin-bottom: -20px;
  color: $white;
  font-size: 18px;
}

/*--------------------------------------*/

</style>
