<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="95px"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="95px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="95px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFoemat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <!-- 显示按钮 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfor.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfor.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressrules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeOrders">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      inputValue: '',
      tableData: [],
      queryInfor: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressrules: {
        address1: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData: cityData,
      progressInfo: [],
      reverse: true
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfor
      })
      this.tableData = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(pagesize) {
      this.queryInfor.pagesize = pagesize
      this.getTableData()
    },
    handleCurrentChange(pagenum) {
      this.queryInfor.pagenum = pagenum
      this.getTableData()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    changeOrders() {
      this.$refs.addressFormRef.validate(valid => {
        if (!valid) return this.$message.error('请正确填写表单')
        this.$message.error('修改地址接口找不到啦！')
      })
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流进度失败！')
      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.input-with-select {
  width: 600px;
}
</style>
