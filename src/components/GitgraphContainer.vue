import {Orientation} from "@gitgraph/core";
import {Orientation} from "@gitgraph/core";
<template>
  <div class="git-graph-container">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { createGitgraph, Orientation } from '@gitgraph/js'
import { GitgraphUserApi } from '@gitgraph/core'

@Component
export default class GitgraphContainer extends Vue {
  name = 'HelloWorld'

  gitgraph!: GitgraphUserApi<SVGElement>

  mounted () {
    const graphContainer = this.$el as HTMLElement

    // Instantiate the graph.
    this.gitgraph = createGitgraph(graphContainer, {
      branchLabelOnEveryCommit: true,
      author: 'Some Developer <some.developer@gfi.world>',
      orientation: Orientation.VerticalReverse
    })

    this.$emit('gitgraph', this.gitgraph)
  }
}
</script>
<style>
.git-graph-container {
  padding-bottom: 24px;
}
</style>
