import { Module, VuexModule } from 'vuex-module-decorators'
import Branch from '@/models/branch'

@Module
export default class BranchModule extends VuexModule {
  develop: Branch = new Branch('develop')
  master: Branch = new Branch('master')

  active: Branch | null = null
}
