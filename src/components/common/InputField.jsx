import TextField from '@mui/material/TextField';

/**
 * @param {{ label: string, value: string, onChange: function, placeholder: string }} props
 */
export default function InputField({ label, value, onChange, placeholder }) {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      size="medium"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{
        shrink: true,
        fontSize: '12px',
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
          fontSize: '16px',
          color: 'var(--gray-1000)',
        },
        '& .MuiInputLabel-root': {
          color: 'var(--gray-1000)',
          backgroundColor: 'white',
        },
        '& input::placeholder': {
          color: 'var(--gray-1000)',
          opacity: 1,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--gray-1000)',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            borderColor: 'var(--gray-500)',
            borderWidth: '1px',
          },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--gray-500)',
        },
      }}
    />
  );
}
