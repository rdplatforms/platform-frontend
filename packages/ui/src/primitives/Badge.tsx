import { Chip, type ChipProps } from '@mui/material';

export interface BadgeProps extends Omit<ChipProps, 'label'> {
  label: string;
}

export function Badge({ label, color = 'primary', size = 'small', ...props }: BadgeProps) {
  return <Chip label={label} color={color} size={size} {...props} />;
}
