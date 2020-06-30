import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { TextInputProps } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const {
    register,
    setValue,
    errors,
    formState: { dirtyFields },
  } = useFormContext();

  useEffect(() => {
    register({ name });
  }, [register, name]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputFilled = useCallback(() => {
    setIsFocused(false);

    setIsFilled(dirtyFields.has(name));
  }, [dirtyFields, name]);

  const handleOnChange = useCallback(
    (text) => {
      setValue(name, text);
    },
    [setValue, name],
  );

  return (
    <Container isFocused={isFocused} isErrored={!!errors[name]}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        {...rest}
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputFilled}
        onChangeText={handleOnChange}
      />
    </Container>
  );
};

export default forwardRef(Input);
