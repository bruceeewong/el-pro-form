<template>
  <el-form
    ref="form"
    class="pro-form"
    inline
    v-bind="$attrs"
    v-on="$listeners"
  >
    <pro-form-layout
      :span="span"
      :should-show="shouldShow"
    >
      <template v-slot:default>
        <!-- 优先识别配置 -->
        <template v-if="items">
          <el-form-item
            v-for="item in shouldRenderItems"
            :key="item.prop || item.label"
            v-bind="item"
          >
            <!-- 动态输入控件 -->
            <pro-form-control
              v-model="form[item.prop]"
              v-bind="item.control"
            />
          </el-form-item>
        </template>
        <!-- 否则透传外部的default slot -->
        <template v-else>
          <slot />
        </template>
      </template>

      <template v-slot:button>
        <el-form-item class="button-group">
          <el-button @click="handleReset">
            重置
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            查询
          </el-button>
          <collapse-button
            v-if="renderItemsLength > showLimit"
            @collapse="handleCollapse"
          />
        </el-form-item>
      </template>
    </pro-form-layout>
  </el-form>
</template>

<script>
import CollapseButton from '../../buttons/CollapseButton';
import ProFormLayout from './components/ProFormLayout';
import ProFormControl from './components/ProFormControl';

export default {
  name: 'ProForm',
  components: {
    CollapseButton,
    ProFormLayout,
    ProFormControl
  },
  props: {
    showLimit: {
      type: Number,
      default: 5 // 隐藏阈值，指定第几个控件之后开始隐藏
    },
    span: {
      type: Number,
      default: 8
    },
    // 配置式声明表单控件
    items: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: true,
      form: {} // 表单
    };
  },
  computed: {
    shouldCollapse() {
      const showLimit = this.showLimit;
      return this.items.length > showLimit;
    },
    // 动态函数，判断当前表单项是否该展示
    shouldShow() {
      return index => {
        const showLimit = this.showLimit;
        return (
          index + 1 <= showLimit || !this.isCollapse // （下标+1）小于隐藏阈值
        ); // 下标大于指定值但点击了展开
      };
    },
    shouldRenderItems() {
      return Array.isArray(this.items)
        ? this.items.filter(item => item.control)
        : [];
    },
    renderItemsLength() {
      return (
        this._getLength(this.shouldRenderItems) ||
        this._getLength(this.$slots.default)
      );
    }
  },
  methods: {
    /**
     * 表单提交响应函数
     * @returns {boolean}
     */
    handleSubmit() {
      this.$emit('submit', { ...this.form });
    },
    handleReset() {
      this.resetFields();
      this.$emit('reset');
    },
    handleCollapse(value) {
      this.isCollapse = value;
    },
    /**
     * 表单校验方法, 提供给父组件调用
     * @returns {boolean}
     */
    validate() {
      let result = false;
      this.$refs.form.validate(valid => {
        result = valid;
      });
      return result;
    },
    /**
     * 表单重置方法
     */
    resetFields() {
      this.$refs.form.resetFields();
      this.form = {};
    },
    _safeGet(map, key) {
      if (!(typeof map === 'object')) return undefined;
      return map[key];
    },
    _getLength(value) {
      return Array.isArray(value) ? value.length : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.pro-form {
  /deep/ .el-form-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }
  /deep/ .el-form-item__content {
    flex: 1;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
  }
  /deep/ input {
    width: 100% !important;
  }
}
</style>
