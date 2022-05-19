<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolelist" border stripe height="700px">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom ', i1 === 0 ? 'bdtop' : '', 'vcentuer']" id="Rightexpand">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- for循环嵌套二级权限 -->
                <el-row v-for="item2 in item1.children" :key="item2.id" id="Rightexpand2" class="vcentuer">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="addRoleClose">
      <el-form :model="addRoleForm" :rules="addFormrules" ref="addRoleRef" label-width="60px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="50%" @close="setDialogClose">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      dialogVisible: false,
      setRightdialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormrules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入职位描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符之间', trigger: 'blur' }
        ]
      },
      // 所有权限的数据
      rightsList :[],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点ID值为数组
      defKeys: [],
      // 当前即将分配权限的Id
      roleid:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    // 添加用户
    async addRole() {
      // 执行增加操作
      const { data: res } = await this.$http.post('/roles', this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.dialogVisible = false
      // 重新获取数据
      this.getRolesList()
    },
    // 根据Id删除角色
    async removeRole(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回字符串 confirm
      // 如果取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 清空添加的弹框
    addRoleClose() {
      this.$refs.addRoleRef.resetFields()
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleid = role.id
      // 获取权限数据
      const {data: res} = await this.$http.get('/rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限数据失败')
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.setRightdialogVisible = true
    },
    // 删除三级tag标签
    async removeRightById(role, rightid) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消了删除!')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    // 通过递归的形式获取角色下所有的三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 当前node不包含children属性,则是三级节点
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配对话框的bug
    setDialogClose() {
      this.defKeys = []
    },
    // 分配权限后的确定
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleid}/rights`,{rids: idStr})
      if(res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.bdtop {
  border: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
#Rightexpand {
  margin-left: 48px;
  margin-right: 48px;
  border-left: none;
  border-right: none;
}
#Rightexpand2 {
  border-top: 1px solid #eee;
}
#Rightexpand2:first-child {
  border-top: none;
}
.vcentuer {
  display: flex;
  align-items: center;
}
/deep/ .el-form-item__label {
  width: 48px;
  line-height: 19px;
  padding: 0 18px 0 0;
}
</style>
