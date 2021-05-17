const schema = {
  columns: [
    { field: 'name', header: 'Роль' },
    { field: 'description', header: 'Описание' },
  ],
  controls: {
    name: {
      value: '',
      type: 'text',
      label: 'Название',
      valid: true,
      touched: true,
      validation: {
        required: true
      }
    },
    description: {
      value: '',
      type: 'text',
      label: 'Описание',
      valid: true,
      touched: true
    },
  }
}

export default schema
