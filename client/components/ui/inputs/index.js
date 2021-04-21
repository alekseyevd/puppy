/* eslint-disable no-unused-vars */
import React from 'react'
import DateInput from './DateInput'
import RadioInput from './Radio'
import TextInput from './TextInput'
import {
  Button,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SelectRef from './SelectRef'

const types = {
  text: TextInput,
  radio: RadioInput,
  date: DateInput,
  ref: SelectRef
}

const Control = (props) => {
  if (!props.type) {
    const name = props.name
    const group = Object.keys(props).filter(prop => prop !== 'name' && prop !== 'onChange' && prop !== 'onRemove').map(prop => {
      return (
        <Control key={name+prop} name={prop} {...props[prop]} onChange={(n, value) => props.onChange(`${name}.${n}`, value)} />
      )
    })
    return (
      <div>
        <p>{name}</p>
        {group}
      </div>
    )
  }

  const component = types[props.type]

  if (component && props.multiple) {
    return (
      <div>
        {
          props.value.map((_, i) => {
            return (
              <React.Fragment key={props.name+i}>
                {component({
                  ...props,
                  value: props.value[i],
                  touched: props.touched[i],
                  valid: props.valid[i],
                  index: i,
                  inputProps: {
                    endAdornment: (
                      <InputAdornment onClick={_ => props.onRemove(props.name, i)}>
                        <IconButton>
                          <HighlightOffIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                })}
              </React.Fragment>
            )
          })
        }
        <Button onClick={_ => props.onChange(props.name, '', props.value.length)}>добавить еще</Button>
      </div>
    )
  }

  if (component) return component(props)

  return null
}

export default Control

