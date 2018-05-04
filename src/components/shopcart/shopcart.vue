<template>
<div class="shopcartcontent">
  <div class="shopcart">
      <div class="content" @click="toggleList">
          <div class="content-left">
              <div class="logo-wrapper">
                  <div class="logo" :class="{'highlight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                  </div>
                  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
              <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right" @click.stop.prevent="pay">
              <div class="pay" :class="payClass">
                  ￥{{payDesc}}
              </div>
          </div>
      </div>
      <div class="ball-container">
          <transition-group name="drop"  @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <span class="inner inner_hook icon-remove_circle_outline"></span>
        </div>
      </transition-group>
      </div>
      <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
              <h1>购物车</h1>
              <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
              <ul>
                  <li class="food" v-for="(food,index) in selectFoods" :key="index">
                      <span class="name">{{food.name}}</span>
                      <div class="price">
                          <span>￥{{food.price*food.count}}</span>
                      </div>
                      <div class="cartcontrol-wrapper">
                          <cartcontrol :food="food"></cartcontrol>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
      </transition>
  </div>
  <transition name="maskMove">
    <div class="list-mask"   @click.stop.prevent="hideList" v-show="listShow"></div>
  </transition>
  </div>
</template>

<script>
import cartcontrol from "components/cartcontrol/cartcontrol";
import Bscroll from "better-scroll";
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 10,
            count: 1
          }
        ];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totaPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  created() {
    // 获取按钮组件的点击的元素，用在drop方法里
    this.$root.eventHub.$on("cart.add", this.drop);
  },
  methods: {
    drop(ele) {
      console.log(ele);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.ele = ele;
          this.dropBalls.push(ball);
          console.log(this.dropBalls);
          return;
        }
      }
    },
    beforeEnter(ele) {
      // 下落小球的下落之前的运动函数钩子
      let len = this.balls.length;
      while (len--) {
        let ball = this.balls[len];
        if (ball.show) {
          let rect = ball.ele.getBoundingClientRect(); // 小球盒模型
          let x = rect.left - 32; // 小球距离购物车图标的位置
          let y = -(window.innerHeight - rect.top - 22);
          ele.style.display = "";
          ele.style.webkitTransform = `translate3d(0,${y}px,0)`;
          ele.style.transform = `translate3d(0,${y}px,0)`;
          let inner = ele.getElementsByClassName("inner_hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(ele) {
      // 下落小球的下落时的运动函数钩子
      ele.offsetHeight; // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => {
        // 改回运动初始状态
        ele.style.webkitTransform = "translate3d(0, 0, 0)";
        ele.style.transform = "translate3d(0,0,0)";
        let inner = ele.getElementsByClassName("inner_hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
      });
    },
    afterEnter(ele) {
      // 下落小球的下落之后的运动函数钩子
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        ele.style.display = "none";
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    hideList() {
      this.fold = true;
    },
    pay(){
        if(this.totalPrice<this.minPrice){
            return;
        }
        console.log(`支付${this.totalPrice}`)
    }
  },
  components: {
    cartcontrol
  }
};
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

.shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    background: #000;

    .content {
        display: flex;
        background: #141d27;
        font-size: 0;
        color: rgba(255, 255, 255, 0.4);

        .content-left {
            flex: 1;

            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;

                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    text-align: center;

                    &.highlight {
                        background: rgb(0, 160, 220);
                    }

                    .icon-shopping_cart {
                        font-size: 24px;
                        color: #80858a;
                        line-height: 44px;

                        &.highlight {
                            color: #fff;
                        }
                    }
                }

                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 16px;
                    font-size: 9px;
                    font-weight: 700;
                    color: #fff;
                    background: rgb(240, 20, 20);
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                }
            }

            .price {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin: 12px 0 0;
                line-height: 24px;
                box-sizing: border-box;
                padding: 0 12px 0 0;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 16px;
                font-weight: 700;

                &.highlight {
                    color: #fff;
                }
            }

            .desc {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin: 12px 0 0 12px;
                font-size: 10px;
            }
        }

        .content-right {
            flex: 0 0 105px;
            width: 105px;

            .pay {
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 12px;
                background: #2b333b;

                &.not-enough {
                    background: #2b333b;
                }

                &.enough {
                    background: #00b43c;
                    color: #fff;
                }
            }
        }
    }

    .ball-container {
        .ball {
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;

            &.drop-enter, &.drop-enter-active {
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

                .inner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(0, 160, 220);
                    transition: all 0.4s linear;
                }
            }
        }
    }

    .shopcart-list {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        background: #fff;
        transform: translate3d(0, -100%, 0);

        &.fold-enter-active, &.fold-leave-active {
            transition: all 0.5s;
        }

        &.fold-leave-active {
            transform: translate3d(0, -100%, 0);
        }

        &.fold-enter, &.fold-leave-active {
            transform: translate3d(0, 0, 0);
        }

        .list-header {
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background: #f3f5f7;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);

            .title {
                float: left;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }

            .empty {
                float: right;
                font-size: 12px;
                color: rgb(0, 160, 220);
            }
        }

        .list-content {
            padding: 0 18px;
            max-height: 217px;
            background: #fff;
            overflow: hidden;

            .food {
                position: relative;
                padding: 12px 0;
                box-sizing: border-box;
                border-1px(rgba(7, 17, 27, 0.1));

                .name {
                    line-height: 24px;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }

                .price {
                    position: absolute;
                    right: 90px;
                    bottom: 12px;
                    line-height: 24px;
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(240, 20, 20);
                }

                .cartcontrol-wrapper {
                    position: absolute;
                    right: 0;
                    bottom: 6px;
                }
            }
        }
    }
}

.list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    filter: blur(10px);
    background-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);

    &.maskMove-enter-active, &.maskMove-leave-active {
        transition: all 0.5s;
    }

    &.maskMove-enter {
        opacity: 1;
    }

    &.maskMove-leave-active {
        opacity: 0;
    }
}
</style>