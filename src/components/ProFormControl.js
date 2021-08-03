import { Input, Select, Option, DatePicker } from 'element-ui';

export const ControlType = {
  INPUT: 'input',
  SELECT: 'select',
  DATE_PICKER: 'datePicker'
};

const internalMetas = ['_selectOptions'];

// pro表单输入控件
export default {
  name: 'ProFormControl',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    type: {
      type: String,
      default: ControlType.INPUT
    },
    render: {
      type: Function
    },
    value: {
      type: [String, Number, Object, Array],
      default: undefined
    },
    // 额外的数据都汇集于此
    meta: {
      type: Object
    }
  },
  render(h) {
    const { type, render } = this.$props;

    // 支持传render props
    if (render) {
      const vnode = render(h);
      // 给外部组件绑定 props "value" 与 listener "change"
      // 外部传递的组件应该都遵循此规范
      const { propsData = {}, listeners = {} } = vnode.componentOptions;
      vnode.componentOptions.propsData = { ...propsData, value: this.value };
      vnode.componentOptions.listeners = {
        ...listeners,
        change: this.handleChange
      };
      return vnode;
    }

    // 否则按默认组件解析
    switch (type) {
      case ControlType.SELECT:
        return this.renderSelect();
      case ControlType.DATE_PICKER:
        return this.renderDatePicker();
      default:
        return this.renderInput();
    }
  },
  computed: {
    // 透传给控件的属性
    controlAttrs() {
      return {
        attrs: this._trimInternalOptions(this.meta)
      };
    }
  },
  methods: {
    handleChange(...values) {
      this.$emit('change', ...values);
    },
    renderInput() {
      return (
        <Input
          placeholder="请输入"
          clearable
          {...this.controlAttrs}
          value={this.value}
          onInput={this.handleChange}
        />
      );
    },
    renderSelect() {
      return (
        <Select
          {...this.controlAttrs}
          value={this.value}
          onChange={this.handleChange}
        >
          {this._getSelectOptions().map(option => {
            return (
              <Option
                key={option.value}
                value={option.value}
                label={option.label}
              ></Option>
            );
          })}
        </Select>
      );
    },
    renderDatePicker() {
      return (
        <DatePicker
          placeholder="请选择时间"
          {...this.controlAttrs}
          type="date"
          value={this.value}
          onInput={this.handleChange}
        />
      );
    },
    _getSelectOptions() {
      return this.meta && Array.isArray(this.meta._selectOptions)
        ? this.meta._selectOptions
        : [];
    },
    // 除掉选项中内置key
    _trimInternalOptions(options) {
      if (!(typeof options === 'object')) return {}; // 返回空对象
      const value = { ...options };
      internalMetas.forEach(key => {
        Reflect.deleteProperty(value, key);
      });
      return value;
    }
  }
};
