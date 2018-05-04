import Vue from 'vue';
import Router from 'vue-router';
import Goods from "components/goods/goods.vue";
import Ratings from "components/ratings/ratings.vue";
import Seller from "components/seller/seller.vue";
Vue.use(Router);


export default new Router({
    linkActiveClass: 'active',
    routes: [
        {path:"/",redirect:"/goods"},//默认显示http://localhost:8080/#/goods
        {path:"/goods",component:Goods},
        {path:"/ratings",component:Ratings},
        {path:"/seller",component:Seller}
    ]
})
