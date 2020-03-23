<template>
  <v-container>
    <v-row>
      <div class="git-graph-container">
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { createGitgraph } from '@gitgraph/js'

@Component
export default class GitgraphContainer extends Vue {
  name = 'HelloWorld'

  mounted () {
    const graphContainer = this.$el.querySelector('.git-graph-container') as HTMLElement

    // Instantiate the graph.
    const gitgraph = createGitgraph(graphContainer, { author: 'Developer <dev@gfi.world>' })

    // Simulate git commands with Gitgraph API.
    const master = gitgraph.branch('master')
    master.commit('Initial commit')

    const develop = gitgraph.branch('develop')
    develop.commit('Add TypeScript')

    const aFeature = gitgraph.branch('a-feature')
    aFeature
      .commit('Make it work')
      .commit({ subject: 'Make it right', hash: 'test' })
      .commit('Make it fast')

    develop.merge(aFeature)
    develop.commit('Prepare v1')

    master.merge(develop).tag('v1.0.0')

    develop.checkout()

    gitgraph.commit('test')
  }
}
</script>
