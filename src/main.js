import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import 'common/stylus/index.styl';
Vue.config.productionTip = false;
//默认显示http://localhost:8080/#/goods
Vue.use(VueResource);
//router.push("./goods");
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    eventHub: new Vue() // 给data添加一个 名字为eventHub 的空vue对象,用来传输非父子组件的数据
  }
});
