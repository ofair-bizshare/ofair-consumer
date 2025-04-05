
import React from 'react';
import { Input } from '@/components/ui/input';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, ...props }, ref) => {
    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only numbers
      let value = e.target.value.replace(/\D/g, '');
      
      // Format as needed
      if (value.length > 0) {
        // Israeli phone format
        if (value.length > 10) {
          value = value.substring(0, 10);
        }
      }
      
      // Update the input value
      e.target.value = value;
      
      // If there's an onChange handler, call it
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    return (
      <Input
        ref={ref}
        type="tel"
        onChange={handlePhoneInput}
        dir="ltr"
        className={className}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
