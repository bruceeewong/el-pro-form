<template>
  <pro-form
    :loading="form.loading"
    :items="form.items"
  >
    <el-form-item label="ID">
      <el-input v-model="form.value.id" />
    </el-form-item>
  </pro-form>
</template>

<script>
import ProForm from '/path/to'

export default {
  component: {
    ProForm,
  },
  data() {
    return {
      form: {
        loading: false,
        value: {
          id: 0,
        }
      },
    }
  }
}
</script>

<style>

</style>