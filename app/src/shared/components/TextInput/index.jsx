// @flow

import React from 'react'

import FormControl, { type FormControlProps } from '../FormControl'
import TextField from '../TextField'

type Props = FormControlProps & {
    className?: ?string,
}

const TextInput = ({ label, className, passwordStrengthUpdate, ...props }: Props) => (
    <FormControl
        {...props}
        passwordStrengthUpdate={passwordStrengthUpdate}
        label={label}
        noUnderline
    >
        {({ value, onFocusChange, setAutoCompleted, ...rest }) => (
            <TextField
                {...rest}
                value={value}
                onBlur={onFocusChange}
                onFocus={onFocusChange}
                onAutoComplete={setAutoCompleted}
            />
        )}
    </FormControl>
)

export default TextInput
