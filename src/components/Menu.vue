<script>
import { mapMutations } from "vuex";
import { logoutFetch } from "../api";
import { ROUTES_CONFIG } from "../router";
import { USER_TYPE } from "../util/enum";

export default {
  setup() {
    return { ROUTES_CONFIG };
  },
  data() {
    return {
      openMenu: false
    };
  },
  methods: {
    ...mapMutations([
      "loadingOpen",
      "loadingClose",
      "userTypeSet",
      "loginStatusSet"
    ]),
    async logoutClick() {
      this.loadingOpen();
      await logoutFetch().then(() => {
        this.userTypeSet({ userType: USER_TYPE.NONE });

        this.loginStatusSet({
          user: {},
          auth: false
        });
      });
      this.loadingClose();
    },
    menuToggle(open) {
      this.openMenu = open;
    },
    linkClick(navigate) {
      navigate();
      this.menuToggle(false);
    }
  }
};
</script>

<template lang="pug">
div.menu-box(:class="{'open':openMenu}" @click.self="menuToggle(false)")
  i.icon-menu(@click="menuToggle(true)")
  div.menu-list(:class="{'open':openMenu}")
    i.icon-close(@click="menuToggle(false)")
    ul
      router-link(:to="ROUTES_CONFIG.home.path" custom v-slot="{ navigate, isActive }" )
        li(@click="linkClick(navigate)" :class="{'active':isActive}") Product List
      router-link(:to="ROUTES_CONFIG.list.path" custom v-slot="{ navigate, isActive }" )
        li(@click="linkClick(navigate)" :class="{'active':isActive}") Order List
    button.btn-secondary(@click="logoutClick")
      i.icon-logout
      span logout

</template>

<style lang="scss" scoped>
.menu-box {
  z-index: 20;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 100%;
  background-color: $color-shadow-100;

  &.open {
    right: 0;
  }
}

.icon-menu {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 32px;
  padding: 10px;
  color: $color-primary-400;
  cursor: pointer;
}

.menu-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  background-color: $color-dark-200;
  box-shadow: 2px 2px 10px $color-shadow-200;
  padding: 40px 0;
  transform: translateX(-100%);
  transition: all 0.3s;

  &.open {
    transform: translateX(0);
  }

  li {
    padding: 10px 40px;
    opacity: 0.5;
    transition: all 0.3s;
    cursor: pointer;

    &:hover,
    &.active {
      text-decoration: underline;
      opacity: 1;
    }
  }
}

.icon-close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 32px;
  padding: 10px;
  color: $color-dark-400;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;

  &:hover {
    opacity: 1;
  }
}

.btn-secondary {
  margin: 40px;
}
</style>
