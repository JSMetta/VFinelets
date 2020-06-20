import Home from './pages/biz/Home.vue'
import ProductForm from './pages/biz/ProductForm.vue'
import SupplierForm from './pages/biz/SupplierForm.vue'
import CustomerForm from './pages/biz/CustomerForm.vue'
import CustomerRequirementForm from './pages/biz/CustomerRequirementForm.vue'
import ProductChainForm from './pages/biz/ProductChainForm.vue'
import MasterProduct from './pages/biz/MasterProduct.vue'
import MasterSupplier from './pages/biz/MasterSupplier.vue'
import MasterCustomer from './pages/biz/MasterCustomer.vue'
import MasterCustomerRequirement from './pages/biz/MasterCustomerRequirement.vue'
import MasterProductChain from './pages/biz/MasterProductChain.vue'
import MasterProductChainPart from './pages/biz/MasterProductChainPart.vue'

const ROLE_BIZ = 'BIZ'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      role: ROLE_BIZ
    },
    component: Home
  },
  {
    path: '/master/product',
    name: 'masterProduct',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterProduct
  },
  {
    path: '/master/supplier',
    name: 'masterSupplier',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterSupplier
  },
  {
    path: '/master/customer',
    name: 'masterCustomer',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterCustomer
  },
  {
    path: '/master/customer/requirement',
    name: 'masterCustomerRequirement',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterCustomerRequirement
  },
  {
    path: '/master/product/chain',
    name: 'masterProductChain',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterProductChain
  },
  {
    path: '/master/product/chain/part',
    name: 'masterProductChainPart',
    meta: {
      role: ROLE_BIZ
    },
    component: MasterProductChainPart
  },
  {
    path: '/forms/product',
    name: 'productForm',
    meta: {
      role: ROLE_BIZ
    },
    component: ProductForm
  },
  {
    path: '/forms/supplier',
    name: 'supplierForm',
    meta: {
      role: ROLE_BIZ
    },
    component: SupplierForm
  },
  {
    path: '/forms/customer',
    name: 'customerForm',
    meta: {
      role: ROLE_BIZ
    },
    component: CustomerForm
  },
  {
    path: '/forms/customer/requirement',
    name: 'customerRequirementForm',
    meta: {
      role: ROLE_BIZ
    },
    component: CustomerRequirementForm
  },
  {
    path: '/forms/product/chain',
    name: 'productChainForm',
    meta: {
      role: ROLE_BIZ
    },
    component: ProductChainForm
  }
]

const starts = {
  BIZ: 'home'
}

export default {
  routes,
  starts
}
