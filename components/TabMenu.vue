<template>
  <div class="menus">
    <router-link :to="'/'" :class="isActive(1)">DASHBOARD</router-link>
    <router-link :to="'/validators'" :class="isActive(2)">VALIDATOR</router-link>
    <router-link :to="'/parameters'" :class="isActive(3)">PARAMETERS</router-link>
  </div>
</template>

<script>
  export default {
    name: 'TabMenu',
    props: {
      active: Number
    },
    methods: {
      isActive(index) {
        return this.active === index ? 'active item' : 'inactive item'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/common";
  .menus {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    > .item{
      height: 2.5rem;
      padding: 0 30px;
      cursor: pointer;
      &:first-child, &:nth-child(2) {
        border-right: 0;
      }
    }
  }
  .inactive {
    background: #FFFFFF;
    border: 1px solid #FF7A59;
    border-radius: 1px;
    font-size: 24px;
    color: #FF7A59;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .active {
    background-color: #FF7A59;
    color: white;
    font-size: 1.3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
