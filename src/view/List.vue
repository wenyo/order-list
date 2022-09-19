<script>
import { mapState } from "vuex";

export default {
    computed:{
        ...mapState(['orderList'])
    },
    mounted(){
        console.log(this.orderList);
    }
}
</script>

<template lang="pug">
ul
    li.title
        div.w-50 id
        div.w-200 item
        div.w-100 price
        div.w-100 count
        div.grow note
    li.content(v-for="item in orderList")
        div.w-50 {{`#${item.id}`}}
        div.w-200 {{item.name}}
        div.w-100 {{item.price}}
        div.w-100 {{item.count}}
        div.grow {{item.note}}

</template>

<style lang="scss" scoped>
    ul{

        .w-50{
            width: 50px;
        }

        .w-100{
            width: 100px;
        }

        .w-200{
            width: 200px;
        }

        li{
            display: flex;
        }

        .title > div{
            background-color: $color-dark-300;
            text-align: left;
            padding: 5px 10px;
        }

        .content{
            border: 1px solid $color-dark-300;
            cursor: pointer;
            transition: all .3s;

            &:hover{
                box-shadow: 2px 2px 10px $color-dark-300;
            }

            div{
                padding: 20px 10px;
            }
        }
    }
</style>