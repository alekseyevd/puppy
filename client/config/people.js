const schema = {
  columns: [
    { field: 'name', header: 'Имя' },
    { field: 'surname', header: 'Фамилия' }
  ],
  controls: {
    name: {
      type: 'text',
      value: '',
      label: 'Имя',
      valid: false,
      touched: false,
      validation: {
        required: true
      }
    },
    surname: {
      type: 'text',
      value: '',
      label: 'Фамилия',
      valid: false,
      touched: false,
      validation: {
        required: true
      }
    },
    patronymic: {
      type: 'text',
      value: '',
      label: 'Отчество',
      valid: true,
      touched: false
    },
    gender: {
      type: 'radio',
      radio: ['Женcкий', 'Мужской'],
      value: null,
      label: 'Пол',
      valid: true,
      touched: false
    },
    birthdate: {
      type: 'date',
      value: null,
      label: 'Дата рождения',
      valid: true,
      touched: false,
      validation: {
        date: true
      }
    },
    phones: {
      type: 'text',
      multiple: true,
      label: 'Телефон',
      format: 'phone',
      value: [''],
      valid: [true],
      touched: [false],
      validation: {
        match: '[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}'
      }
    },
    emails: {
      type: 'text',
      multiple: true,
      label: 'Email',
      value: [''],
      valid: [true],
      touched: [false],
      validation: {
        email: true
      }
    },
    passport: {
      number: {
        type: 'text',
        label: 'Номер',
        value: '',
        valid: true,
        touched: false
      },
      issuedDate: {
        type: 'date',
        label: 'Дата выдачи',
        value: null,
        valid: true,
        touched: false,
        validation: {
          date: true
        }
      },
      issuedBy: {
        type: 'text',
        label: 'Кем выдан',
        value: '',
        valid: true,
        touched: false
      },
    },
    addedBy: {
      value: null,
      type: 'ref',
      touched: false,
      valid: true,
      options: {
        ref: 'users',
        inputValue: 'login',
      },
      validation: {
        hasProperty: '_id'
      }
    }
  }
}

export default schema
