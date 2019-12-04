// @flow

import React from 'react'

import FormControl, { type FormControlProps, type InputProps } from '../FormControl'
import Select, { type Props as SelectProps } from './Select'

type Props = FormControlProps & SelectProps

type InnerProps = InputProps

class SelectInput extends React.Component<Props> {
    static Input = Select

    render() {
        const { label, ...props } = this.props
        return (
            <FormControl
                noUnderline
                preserveLabelSpace
                preserveLabelPosition
                {...props}
                label={label}
            >
                {({ value, onFocusChange, setAutoCompleted, ...rest }: InnerProps) => (
                    <Select
                        {...((rest: any): SelectProps)}
                        value={value}
                        onBlur={onFocusChange}
                        onFocus={onFocusChange}
                    />
                )}
            </FormControl>
        )
    }
}

export default SelectInput
