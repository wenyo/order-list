<template lang="pug">
div.loading
  span
</template>

<style lang="scss" scoped>
.loading {
  z-index: 99;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-shadow-200;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border-width: 3px;
    border-style: solid;
    border-color: transparent $color-dark-100 $color-dark-100;
    animation: rotation 1.5s infinite ease-in-out;
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
