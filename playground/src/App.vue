<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn text>
        <span>Checkout</span>
      </v-btn>
      <v-btn text>
        <span>Commit</span>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <GitgraphContainer></GitgraphContainer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import GitgraphContainer from '@/components/GitgraphContainer.vue'

@Component({
  components: { GitgraphContainer }
})
export default class App extends Vue {

}

</script>
