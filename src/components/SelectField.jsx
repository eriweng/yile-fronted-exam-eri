import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

/**
 * @param {{ label: string, value: string|number, onChange: function, options: Array<{id: number, label: string}>, placeholder: string }} props
 */
export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder,
}) {
  return (
    <FormControl
      size="medium"
      variant="outlined"
      fullWidth
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
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <MuiSelect
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        {placeholder && (
          <MenuItem value="">
            <span style={{ color: '#808080' }}>{placeholder}</span>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
