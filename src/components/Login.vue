<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/css/login.jpg" />
      </div>
      <!-- 登录表单区 -->
      <!-- 账号框 -->
      <el-form label-width="0" class="login_form" :model="LoginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="LoginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域   -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据绑定对象
      LoginForm: {
        username: '',
        password: ''
      },
      // 表单的验证规则对象
      loginRules: {
        // 验证用户名是否合法
        username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async validate => {
        if(!validate) return
        const {data : res} = await this.$http.post('login',this.LoginForm)
        if(res.meta.status !== 200) return  this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1.将登录成功之后的token,保存到客户端的sessionStorage中
        //   1.1项目中除了登录之外的其他API接口,必须在登录之后才能访问
        //   1.2 token只应在当前网站打开期间生效, 所以将token保存在sessionstorge中
        window.sessionStorage.setItem("token",res.data.token)
        // 2.通过编程时导航跳转到后台主页,路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 20px grey;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
