const schema = {
  columns: [
    { field: 'login', header: 'Логин' },
    { field: 'role', header: 'Роль' }
  ],
  controls: {
    login: {
      value: '',
      type: 'text',
      label: 'Логин',
      errorMessage: 'Введите логин',
      valid: false,
      touched: false,
      validation: {
        required: true
      }
    },
    password: {
      value: '',
      type: 'password',
      label: 'Пароль',
      valid: false,
      touched: false,
      validation: {
        required: true
      }
    },
    role: {
      value: null,
      label: 'Роль',
      type: 'ref',
      touched: false,
      valid: false,
      options: {
        ref: 'roles',
        inputValue: 'name',
      },
      validation: {
        required: true,
        hasProperty: '_id'
      }

    },
    phone: {
      value: '',
      type: 'text',
      label: 'Телефон',
      valid: false,
      touched: false,
      format: 'phone',
      validation: {
        match: '[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}'
      }
    },
    email: {
      value: '',
      type: 'text',
      label: 'Email',
      valid: false,
      touched: false,
      validation: {
        email: true
      }
    }
  }
}

export default schema
