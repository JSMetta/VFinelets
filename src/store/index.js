// import createStore from '../../finelets/store/CreateStore'
import actions from './actions'
import states from './states'
import mutations from './mutations'
import getters from './getters'

const items = ['selectedProduct', 'selectedSupplier', 'selectedCustomer']

const config = {
  items, states, getters, mutations, actions  
}
export default config
