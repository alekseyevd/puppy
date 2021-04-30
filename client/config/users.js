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
      valid: true,
      touched: true,
      validation: {
        required: true
      }
    },
    password: {
      value: '',
      type: 'password',
      label: 'Пароль',
      errorMessage: 'Введите пароль',
      valid: true,
      touched: true
    },
    role: {
      value: '',
      type: 'select',
      label: 'Роль',
      valid: true,
      touched: true,
      validation: {
        required: true
      }
    },
    phone: {
      value: '',
      label: 'Телефон',
      valid: true,
      touched: true,
      format: 'phone',
      validation: {
        match: '[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}'
      }
    },
    email: {
      value: '',
      label: 'Email',
      valid: true,
      touched: true,
      validation: {
        email: true
      }
    }
  }
}

export default schema
