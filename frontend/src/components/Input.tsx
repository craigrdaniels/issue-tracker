import clsx from 'clsx'

type InputProps = {
  label?: string
  type: string
  id: string
  placeholder?: string
  defaultValue?: string
  error?: string
  required?: true
  pattern?: string
  onChange?: any
  name?: string
  value?: string
}

export const Input = ({
  label,
  type,
  id,
  placeholder,
  defaultValue,
  error,
  required,
  pattern,
  onChange,
  name,
  value,
}: InputProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between">
        <label htmlFor={id} className="font-semibold capitalize">
          {label}
        </label>
      </div>
      <input
        id={id}
        type={type}
        className={clsx('input', error && 'input-error')}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        pattern={pattern}
        onChange={onChange}
        name={name}
        value={value}
      />
      <div className="flex justify-end">
        <span className="text-error">{error && '* ' + error}</span>
      </div>
    </div>
  )
}
