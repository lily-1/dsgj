/**
 * Created by renxunhao on 2017/12/25.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
    getters,
    state,
    actions,
    mutations
});
