import { BranchUserApi, GitgraphBranchOptions, GitgraphTagOptions, GitgraphUserApi } from '@gitgraph/core'
import { LoremIpsum } from 'lorem-ipsum'

export interface GitflowBranch<TNode> {
  name: string;
  branch: BranchUserApi<TNode>;

  tag (tag: string): this;

  commit (subject?: string): this;

  merge (branchName: string, subject?: string): this;

  finish (): void;
}

export class GitflowBranch<TNode> implements GitflowBranch<TNode> {
  public name: string
  public gitgraph: GitgraphUserApi<TNode>
  public branch: BranchUserApi<TNode>
  private mergeTo: string[]
  private messageProvider: (subject?: string) => string
  private tagProvider?: () => (string | GitgraphTagOptions<TNode> | null)

  constructor (
    gitgraph: GitgraphUserApi<TNode>, branchOptions: string | GitgraphBranchOptions<TNode>,
    mergeTo: string[],
    messageProvider: (subject?: string) => string,
    tagProvider?: () => (string | GitgraphTagOptions<TNode>) | null) {
    this.gitgraph = gitgraph
    if (typeof branchOptions === 'string') {
      branchOptions = { name: branchOptions }
    }
    this.name = branchOptions.name
    this.branch = this.gitgraph.branch(branchOptions)
    this.mergeTo = mergeTo
    this.messageProvider = messageProvider
    this.tagProvider = tagProvider
  }

  tag (tag: string) {
    this.branch.tag(tag)
    return this
  }

  commit (subject?: string) {
    const message = this.messageProvider(subject)
    this.branch.commit(message)
    return this
  }

  merge (branchName: string, subject?: string): this {
    this.branch.merge(branchName, subject)
    return this
  }

  finish (): BranchUserApi<TNode> {
    let branch = this.branch
    let i = 0

    const tag = this.tagProvider ? this.tagProvider() : null

    for (const mergeToItem of this.mergeTo) {
      const mergeToBranch = this.gitgraph.branch(mergeToItem)
      mergeToBranch.merge(branch.name)
      branch = mergeToBranch

      if (tag && i === 0) {
        if (typeof tag === 'string') {
          this.gitgraph.tag(tag)
        } else {
          this.gitgraph.tag(tag)
        }
      }

      i++
    }

    return branch
  }
}

export const loremIpsum = new LoremIpsum({ wordsPerSentence: { min: 3, max: 6 } })

export function generateCommitMessage () {
  const sentence = loremIpsum.generateSentences(1)
  return sentence.substring(0, sentence.length - 1)
}

const defaultTypes = [
  'build',
  'ci',
  'chore',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test'
]

const defaultComponents = [
  'ui',
  'service',
  'data',
  'model',
  'controller'
]

export function messageProviderFactory (types = defaultTypes, components = defaultComponents) {
  return (subject?: string) => {
    if (!subject) {
      subject = generateCommitMessage()
    }
    const randomType = types[Math.floor(Math.random() * types.length)]

    if (!components.length) {
      return `${randomType}: ${subject}`
    }

    const randomComponent = components[Math.floor(Math.random() * components.length)]
    return `${randomType}(${randomComponent}): ${subject}`
  }
}
