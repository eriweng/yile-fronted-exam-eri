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
        '& .MuiInputLabel-root': {
          fontSize: '12px',
          color: 'var(--gray-1000)',
          backgroundColor: 'var(--gray-100)',
          padding: '0 6px',
          marginLeft: '-4px',
        },
        '& .MuiInputLabel-shrink': {
          transform: 'translate(14px, -9px) scale(1)',
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
    >
      <InputLabel id={`${label}-label`} shrink>
        {label}
      </InputLabel>
      <MuiSelect
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <span style={{ color: 'var(--gray-1000)' }}>{placeholder}</span>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
