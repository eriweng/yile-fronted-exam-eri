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
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
          fontSize: '16px',
          color: '#4d4d4d',
        },
        '& .MuiInputLabel-root': {
          fontSize: '12px',
          color: '#808080',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#808080',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            borderColor: '#d4d4d4',
            borderWidth: '1px',
          },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#d4d4d4',
        },
      }}
    />
  );
}
