<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script>
import header from 'components/header/header';
import {getSeller} from '../src/api';
import {urlParse} from 'common/js/util';
const ERR_OK=0;
export default {
  data(){
    return {
      seller:{
        id:(()=>{
          let queryParm=urlParse();
          return queryParm.id;
        })()
      }
    }
  },
  created(){
    getSeller('/api/seller?id='+this.seller.id).then((response)=>{
      if(response.data.errno===ERR_OK){
          this.seller=Object.assign({},this.seller,response.data.data);
      }
    })
  },
  methods:{

  },
  components:{
    'v-header':header
  }
};
</script>


<style lang="stylus">
@import './common/stylus/mixin.styl';
  #app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex 1
        text-align center
        &>a
          display block
          text-decoration none
          font-size 14px
          color #778593
          &.active
            color #f01414
</style>
