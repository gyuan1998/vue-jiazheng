<template>
  <div class="commentDetails">
    <h2>订单详情</h2>
    <el-button size="small" type="text" @click="backHandler">返回</el-button>
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="基本信息" name="info">
          基本信息...
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="orders">
        订单信息...
      </el-tab-pane> -->     
      <el-tab-pane label="订单详情" name="address">
        <el-table :data="orderDetail">
          <el-table-column label="员工编号" prop="waiterId"></el-table-column>
          <el-table-column label="市" prop="city"></el-table-column>
          <el-table-column label="区" prop="area"></el-table-column>
          <el-table-column label="街道" prop="address"></el-table-column>
          <el-table-column label="手机号" prop="telephone"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  data(){
    return {
      activeName:"info"
    }
  },
  created(){
    console.log(this.$route);
    let id = this.$route.query.id;
    // 通过id查询顾客，订单，地址
    this.findAllOrders(id)
    .then((response)=>{
      this.orderDetail = response.map(item=>item.id===response.data.id)
    })
  },
  computed:{
    ...mapState("comment",["orderDetail"])
  },
  methods:{
    ...mapActions("comment",["findAllOrders"]),
    backHandler(){
      // this.$router.push("/customer")
      this.$router.go(-1)
    }
  }

}
</script>
<style scoped>


</style>