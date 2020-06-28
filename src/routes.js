import Home from './pages/home.vue'
import RunProgram from './pages/dev/RunProgram.vue'
import DevHome from './pages/dev/Home.vue'

import POView from './pages/POView.vue'
import POEditor from './pages/POEditor.vue'
import MasterPart from './pages/MasterPart.vue'
import MasterSupplier from './pages/MasterSupplier.vue'
import PartForm from './pages/PartForm.vue'
import SupplierForm from './pages/SupplierForm.vue'
import PurchaseForm from './pages/PurchaseForm.vue'
import WithdrawForm from './pages/WithdrawForm.vue'
import PurchaserHome from './pages/purchaser/Home.vue'
import MasterPurchase from './pages/purchaser/MasterPurchase.vue'
import PoInv from './pages/purchaser/PoInv.vue'

import CeoHome from './pages/ceo/CeoHome.vue'
import CeoMasterPart from './pages/ceo/MasterPart.vue'
import CeoMasterSupplier from './pages/ceo/MasterSupplier.vue'
import CeoMasterPurchase from './pages/ceo/MasterPurchase.vue'

const ROLE_DEV = 'DEV'
const ROLE_PURCHASER = 'PURCHASER'
const ROLE_CEO = 'CEO'

const masterPurchaseSubroutes = [
  {
    path: '/master/purchase/content',
    name: 'masterPOView',
    component: POView,
    meta: {
      role: ROLE_PURCHASER
    }
  },
  {
    path: '/master/purchase/edit',
    name: 'masterEditPO',
    component: POEditor,
    meta: {
      role: ROLE_PURCHASER
    }
  }
]

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {public: true},
    component: Home
  },
  {
    path: '/dev/runprogram',
    name: 'runProgram',
    meta: {
      role: ROLE_DEV
    },
    component: RunProgram
  },
  {
    path: '/dev/home',
    name: 'devHome',
    meta: {
      role: ROLE_DEV
    },
    component: DevHome
  },
  {
    path: '/pur/home',
    name: 'purchaserHome',
    meta: {
      role: ROLE_PURCHASER
    },
    component: PurchaserHome
  },
  {
    path: '/pur/master/part',
    name: 'masterPart',
    meta: {
      role: ROLE_PURCHASER
    },
    component: MasterPart
  },
  {
    path: '/pur/master/supplier',
    name: 'masterSupplier',
    meta: {
      role: ROLE_PURCHASER
    },
    component: MasterSupplier
  },
  {
    path: '/pur/master/purchase',
    name: 'masterPurchase',
    meta: {
      role: ROLE_PURCHASER
    },
    component: MasterPurchase,
    children: masterPurchaseSubroutes
  },
  {
    path: '/pur/forms/part',
    name: 'partForm',
    meta: {
      role: ROLE_PURCHASER
    },
    component: PartForm
  },
  {
    path: '/pur/forms/supplier',
    name: 'supplierForm',
    meta: {
      role: ROLE_PURCHASER
    },
    component: SupplierForm
  },
  {
    path: '/pur/forms/purchase',
    name: 'purchaseForm',
    meta: {
      role: ROLE_PURCHASER
    },
    component: PurchaseForm
  },
  {
    path: '/pur/forms/withdraw',
    name: 'withdrawForm',
    meta: {
      role: ROLE_PURCHASER
    },
    component: WithdrawForm
  },
  {
    path: '/pur/forms/purchase/inv',
    name: 'POInvTransaction',
    component: PoInv,
    meta: {
      role: ROLE_PURCHASER
    }
  },
  {
    path: '/ceo/home',
    name: 'ceoHome',
    meta: {
      role: ROLE_CEO
    },
    component: CeoHome
  }, {
    path: '/ceo/master/part',
    name: 'ceoMasterPart',
    meta: {
      role: ROLE_CEO
    },
    component: CeoMasterPart
  },
  {
    path: '/ceo/master/supplier',
    name: 'ceoMasterSupplier',
    meta: {
      role: ROLE_CEO
    },
    component: CeoMasterSupplier
  }, {
    path: '/ceo/master/purchase',
    name: 'ceoMasterPurchase',
    meta: {
      role: ROLE_CEO
    },
    component: CeoMasterPurchase
  }
]

const starts = {
  DEV: 'devHome',
  CEO: 'ceoHome',
  PURCHASER: 'purchaserHome'
}

export default {
  routes,
  starts
}
