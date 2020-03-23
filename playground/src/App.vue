<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-menu v-model="checkoutMenuVisible" :close-on-content-click="false">
        <template v-slot:activator="{ on: menu }">
          <v-btn
            color="accent"
            class="ml-4"
            style="min-width: 200px"
            v-on="{ ...menu }"
          >
            <v-icon class="mr-2">mdi-source-branch</v-icon>
            {{ currentBranch ? currentBranch.name : 'Checkout' }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(branch, index) in otherBranchNames"
            :key="index"
            @click="checkout(branch)">
            <v-list-item-title><span :class="{'current': currentBranch ? currentBranch.name === branch : false}">{{ branch }}</span>
            </v-list-item-title>
          </v-list-item>
          <template
            v-for="group in menuGroups">

            <v-subheader :key="group.title">{{group.title}}</v-subheader>

            <v-list-item
              v-for="branch in group.branchNames"
              :key="branch"
              @click="checkout(branch)">
              <v-list-item-title><span :class="{'current': currentBranch ? currentBranch.name === branch : false}">{{ branch }}</span>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <v-btn text @click="commit()" class="ml-4">
        <v-icon class="mr-1">mdi-source-commit</v-icon>
        <span>Commit</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="finish()" v-if="canFinish" color="accent" class="mr-4">
        <v-icon class="mr-1">mdi-check-circle</v-icon>
        <span>Finish</span>
      </v-btn>
      <v-btn text @click="startFeature()">
        <v-icon class="mr-1">mdi-flask</v-icon>
        <span>Feature</span>
      </v-btn>
      <v-btn text @click="startHotfix()">
        <v-icon class="mr-1">mdi-bug</v-icon>
        <span>Hotfix</span>
      </v-btn>
      <v-btn text @click="startRelease()">
        <v-icon class="mr-1">mdi-package-variant</v-icon>
        <span>Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <GitgraphContainer ref="graphContainer"></GitgraphContainer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import GitgraphContainer from '@/components/GitgraphContainer.vue'
import { Ref } from 'vue-property-decorator'
import { GitflowBranch, loremIpsum, messageProviderFactory } from '@/gitflow'
import { BranchUserApi, GitgraphBranchOptions, GitgraphUserApi } from '@gitgraph/core'
import SemVer from 'semver/classes/semver'

@Component({
  components: { GitgraphContainer }
})
export default class App extends Vue {
  @Ref()
  graphContainer!: GitgraphContainer

  checkoutMenuVisible = false

  currentBranch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | null = null
  branches: (GitflowBranch<SVGElement> | BranchUserApi<SVGElement>)[] = []
  branchByName: { [name: string]: (GitflowBranch<SVGElement> | BranchUserApi<SVGElement>) } = {}

  version!: SemVer
  messageProvider!: (subject?: string) => string

  mounted () {
    this.version = new SemVer('1.0.0')
    this.messageProvider = messageProviderFactory()
    this.reset()
  }

  get menuGroups () {
    return [
      {
        title: 'Feature',
        branchNames: this.featureBranchNames
      },
      {
        title: 'Hotfix',
        branchNames: this.hotfixBranchNames
      },
      {
        title: 'Release',
        branchNames: this.releaseBranchNames
      }
    ].filter(group => group.branchNames.length > 0)
  }

  getBranchName (branch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string): string {
    if (typeof branch === 'string') {
      return branch
    }

    return branch.name
  }

  getBranchUserApi (branch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string): BranchUserApi<SVGElement> {
    if (branch instanceof BranchUserApi) {
      return branch
    }
    if (typeof branch === 'string') {
      return this.gitgraph.branch(branch)
    }
    return branch.branch
  }

  get branchNames (): string[] {
    return this.branches.map((branch) => this.getBranchName(branch))
  }

  get featureBranchNames (): string[] {
    return this.branchNames
      .filter((branchName) => branchName.startsWith('feature/'))
  }

  get hotfixBranchNames (): string[] {
    return this.branchNames
      .filter((branchName) => branchName.startsWith('hotfix/'))
  }

  get releaseBranchNames (): string[] {
    return this.branchNames
      .filter((branchName) => branchName.startsWith('release/'))
  }

  get otherBranchNames (): string[] {
    return this.branchNames
      .filter((branchName) => !branchName.startsWith('feature/') && !branchName.startsWith('hotfix/') && !branchName.startsWith('release/'))
  }

  get gitgraph (): GitgraphUserApi<SVGElement> {
    return this.graphContainer.gitgraph
  }

  startFeature (baseBranch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string = 'develop') {
    const branchOptions: GitgraphBranchOptions<SVGElement> = {
      name: `feature/${loremIpsum.generateWords(1)}`,
      from: this.getBranchUserApi(baseBranch)
    }

    this.currentBranch = new GitflowBranch(this.gitgraph,
      branchOptions,
      ['develop'],
      messageProviderFactory(['feat']))
      .commit()
    this.registerBranch(this.currentBranch)

    this.scrollToBottom()
  }

  startHotfix (baseBranch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string = 'master') {
    const branchOptions: GitgraphBranchOptions<SVGElement> = {
      name: `hotfix/${loremIpsum.generateWords(1)}`,
      from: this.getBranchUserApi(baseBranch)
    }

    this.currentBranch = new GitflowBranch(this.gitgraph,
      branchOptions,
      ['master', 'develop'],
      messageProviderFactory(['fix']),
      () => {
        this.version.patch++
        return 'v' + this.version.format()
      })
      .commit()
    this.registerBranch(this.currentBranch)

    this.scrollToBottom()
  }

  startRelease (baseBranch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string = 'develop') {
    const branchOptions: GitgraphBranchOptions<SVGElement> = {
      name: `release/${loremIpsum.generateWords(1)}`,
      from: this.getBranchUserApi(baseBranch)
    }

    this.currentBranch = new GitflowBranch(this.gitgraph,
      branchOptions,
      ['master', 'develop'],
      messageProviderFactory(['ci', 'build'], []),
      () => {
        this.version.patch = 0
        this.version.minor++
        return 'v' + this.version.format()
      })
      .commit()
    this.registerBranch(this.currentBranch)

    this.scrollToBottom()
  }

  finish () {
    if (this.currentBranch instanceof GitflowBranch) {
      const branch = this.currentBranch.finish()
      this.unregisterBranch(this.currentBranch)
      this.checkout(branch)
      this.scrollToBottom()
    }
  }

  get canFinish () {
    return this.currentBranch instanceof GitflowBranch
  }

  checkout (branch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement> | string): GitflowBranch<SVGElement> | BranchUserApi<SVGElement> {
    this.checkoutMenuVisible = false
    const branchObject = this.gitgraph.branch(this.getBranchName(branch))
    const existingBranch = this.branchByName[branchObject.name]
    if (existingBranch) {
      this.currentBranch = existingBranch
      return existingBranch
    } else {
      this.registerBranch(branchObject)
      this.currentBranch = branchObject
      return branchObject
    }
  }

  commit (subject?: string) {
    if (this.currentBranch) {
      if (this.currentBranch instanceof GitflowBranch) {
        this.currentBranch.commit(subject)
      } else {
        const message = this.messageProvider(subject)
        this.currentBranch.commit(message)
      }
      this.scrollToBottom()
    }
  }

  reset (clearGraph = true) {
    if (clearGraph) {
      this.gitgraph.clear()
    }

    this.checkout('master').commit('Initial commit').tag('v' + this.version.format())
    this.checkout('develop').merge('master', 'Merge master branch')
  }

  private registerBranch (branch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement>) {
    this.branchByName[branch.name] = branch
    this.branches.push(branch)
  }

  private unregisterBranch (branch: GitflowBranch<SVGElement> | BranchUserApi<SVGElement>) {
    delete this.branchByName[branch.name]
    const indexOf = this.branches.indexOf(branch)
    if (indexOf > -1) {
      this.branches.splice(indexOf, 1)
    }
  }

  private scrollToBottom () {
    return this.$nextTick().then(() => {
      window.setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, 0)
    })
  }
}
</script>
<style>
.current {
  font-weight: bold;
}
</style>
