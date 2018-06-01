import Vue from 'vue'
import Vuex from 'vuex'
import { fakeMutations, mount, beforeEachHooks, afterEachHooks } from 'src'

Vue.use(Vuex)

describe('fakeMutations', () => {
  beforeEach(beforeEachHooks)
  afterEach(afterEachHooks)

  const ComponentWithMutations = {
    template: '<p></p>',
    methods: {
      foo (...args) { return this.$store.commit('bar', ...args) },
      qux (...args) { return this.$store.commit('qaz', ...args) }
    }
  }

  it('returns a sinon stub for a given mutation', () => {
    const bar = fakeMutations('bar')
    const vm = mount(ComponentWithMutations)

    vm.foo()

    expect(bar).to.have.been.calledOnce
  })

  it('can assert against what arguments a mutations was commited with', () => {
    const bar = fakeMutations('bar')
    const vm = mount(ComponentWithMutations)

    vm.foo({ one: 1, two: 2 })

    expect(bar).to.have.been.calledOnce.and.calledWith({ one: 1, two: 2 })
  })

  it('can stub what the mutation returns using sinon', () => {
    const mutation = fakeMutations('bar').returns(Promise.resolve('baz'))

    const vm = mount(ComponentWithMutations)

    return vm.foo().then(message => {
      expect(mutation).to.have.been.calledOnce
      expect(message).to.equal('baz')
    })
  })

  it('takes an object to stub multiple mutations', () => {
    fakeMutations({
      bar: Promise.resolve(1),
      qaz: Promise.resolve(2)
    })

    const vm = mount(ComponentWithMutations)

    return vm.foo().then(message => {
      expect(message).to.equal(1)
      return vm.qux()
    }).then(message => {
      expect(message).to.equal(2)
    })
  })
})
