import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@root/.shared/store/store'

const getVueShortkey = () => import('vue-shortkey')
const getCustomTransitions = () => import('@root/.shared/plugins/CustomTransitions')
const getVueSanitize = () => import("vue-sanitize")

import vuetify from '@root/.shared/plugins/vuetify'
import BreakpointMixin from '@root/.shared/plugins/BreakpointMixin'
import DBMixin from '@root/.shared/plugins/DBMixin'
import DebugHelper from '@root/.shared/plugins/DebugHelper'
import DialogMixin from '@root/.shared/plugins/DialogMixin'
import FormatMixin from '@root/.shared/plugins/FormatMixin'
import IconMixin from '@root/.shared/plugins/IconMixin'
import RandomMixin from '@root/.shared/plugins/RandomMixin'
import ProficiencyMixin from '@root/.shared/plugins/ProficiencyMixin'

import globals from '@/mixin/globals'

import { $rsd } from '@/plugins/RSDPlugin'
import { mapGetters, mapState } from 'vuex'

/* Custom directives  */
Vue.config.productionTip = false
Vue.mixin(BreakpointMixin);
Vue.mixin(DBMixin);
Vue.mixin(DebugHelper);
Vue.mixin(DialogMixin);
Vue.mixin(FormatMixin);
Vue.mixin(IconMixin);
Vue.mixin(ProficiencyMixin);
Vue.mixin(RandomMixin);

Vue.mixin({
    computed: {
        $rsd: () => $rsd,
        ...mapState(['pf2e', 'rsd']),
        ...mapGetters({
            activeSettings: 'remotedb/activeSettings',
            bottomsheet: 'rsd/bottomsheet',
            bottomsheetUID: 'rsd/bottomsheetUID',
            buildView: 'rsd/buildView',
            combat: 'remotedb/combat',
            cround: 'remotedb/cround',
            dialog: 'rsd/dialog',
            dialogUID: 'rsd/dialogUID',
            gameView: 'rsd/gameView',
            mobileView: 'rsd/mobileView',
            playerCharacterActiveKey: 'remotedb/playerCharacterActiveKey',
            playerCharacterActive: 'remotedb/playerCharacterActive',
            refresh: 'rsd/refresh',
            settings: 'remotedb/settings',
            tindex: 'rsd/tindex',
        })
    }
})

Vue.mixin(globals);

getVueShortkey().then(mod => {
    Vue.use(mod.default)
})
getCustomTransitions().then(mod => {
    Vue.component(mod.fadeXWidthTransition.name, mod.fadeXWidthTransition.obj)
})
getVueSanitize().then(mod => {
    const defaultOptions = {
        allowedTags: ['a', 'b', 'span', 'p', 'i', 'div', 'strong', 'skill', 'damage', 'hr', 'br'],
        allowedAttributes: {
          'a': [ 'href', 'style' ]
        }
    };
    Vue.use(mod, defaultOptions)
})

new Vue({
    router,
    vuetify,
    store,
    render: function (h) { return h(App) }
}).$mount('#app')