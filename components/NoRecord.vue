<template>
  <div class="noRecord">
    <SvgIcon iconName="noRecord" className="icon"></SvgIcon>
    <div class="desc">No record</div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.noRecord {
  padding: rem(40) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    width: rem(60);
    height: rem(60);
  }
  .desc {
    font-size: rem(14);
    color: $gray300;
  }
}
</style>
