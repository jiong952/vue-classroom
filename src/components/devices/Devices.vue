<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb name1="设备管理" name2="设备列表" />
    <h1>设备管理界面</h1>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
export default {
  name: "Devices",
  components: {
    //面包屑组件
    Breadcrumb
  },
}
</script>

<style lang="less" scoped>

</style>