<template lang="pug">
div.menu-box
  i.icon-menu
  ul
    li home
    li cart

</template>

<style lang="scss" scoped>
.menu-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-shadow-100;

  .icon-menu {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 32px;
    padding: 10px;
    color: $color-primary-400;
    cursor: pointer;
  }
}

ul {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  background-color: $color-dark-200;
  box-shadow: 2px 2px 10px $color-shadow-200;
  padding: 40px;

  li {
    padding: 10px 0;
  }
}
</style>
