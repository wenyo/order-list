<script>
import { mapMutations, mapState } from "vuex";
import { logoutFetch } from "../api";
import { ROUTES_CONFIG, ROUTES_KEYS } from "../router";
import { USER_TYPE } from "../util/enum";

export default {
  setup() {
    const MENU_KEY = [ROUTES_KEYS.home, ROUTES_KEYS.list];
    return { ROUTES_CONFIG, MENU_KEY, USER_TYPE };
  },
  data() {
    return {
      openMenu: false
    };
  },
  computed: {
    ...mapState(["userType", "user"])
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
    },
    menuItemShow(menu_key) {
      const { admin, customer } = ROUTES_CONFIG[menu_key].meta;

      switch (this.userType) {
        case USER_TYPE.ADMIN:
          return admin;
        case USER_TYPE.CUSTOMER:
          return customer;
        default:
          break;
      }

      return true;
    }
  }
};
</script>

<template lang="pug">
div.menu-box(:class="{'open':openMenu}" @click.self="menuToggle(false)")
  i.icon-menu(@click="menuToggle(true)")
  div.menu-list(:class="{'open':openMenu}")
    i.icon-close(@click="menuToggle(false)")
    div.user
      span Hi {{user.displayName}}!
      span {{USER_TYPE[userType]?.toLowerCase()}}
    ul
      template(v-for="(menuKey, key) in MENU_KEY" :key="key")
        router-link(v-if="menuItemShow(menuKey)" :to="ROUTES_CONFIG[menuKey].path" custom v-slot="{ navigate, isActive }" )
          li(@click="linkClick(navigate)" :class="{'active':isActive}") {{ROUTES_CONFIG[menuKey].text}}
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

.user {
  margin: 0 40px 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid $color-dark-400;
  font-size: 25px;

  :last-child {
    font-size: 14px;
    color: $color-dark-400;
  }
}
</style>
