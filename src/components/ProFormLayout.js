import { Row as ElRow, Col as ElCol } from 'element-ui';

// 为传入的 el-form-item 数组每个都包裹一个 el-col 布局组件
// 为 button slot 也包裹一个 el-col 组件
export default {
  name: 'ProFormLayout',
  props: {
    shouldShow: {
      type: Function,
      default: index => true
    },
    span: {
      type: Number,
      default: 6
    }
  },
  render(h) {
    return (
      <div>
        <ElRow gutter={32}>
          {this.$slots.default.map((vnode, index) => {
            return (
              <ElCol
                v-show={this.shouldShow(index)}
                key={vnode.key}
                span={this.span}
              >
                {vnode}
              </ElCol>
            );
          })}
          <ElCol span={this.span} style={{ float: 'right' }}>
            {this.$slots.button}
          </ElCol>
        </ElRow>
      </div>
    );
  }
};
