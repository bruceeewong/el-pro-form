<template>
  <pro-form
    :loading="form.loading"
    :items="form.items"
  />
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
        items: [
          {
            prop: 'id',
            label: 'ID',
            control: {
              type: 'input'
            },
          },
          {
            prop: 'others',
            label: 'Others',
            control: {
              type: 'select',
              meta: {
                _selectOptions: [
                  {
                    value: 1,
                    label: '1'
                  },
                  {
                    value: 2,
                    label: '2'
                  },
                ]
              }
            },
          },
        ]
      },
    }
  }
}
</script>

<style>

</style>