import { Container as MuiContainer, type ContainerProps } from '@mui/material';

export function Container(props: ContainerProps) {
  return <MuiContainer maxWidth="lg" {...props} />;
}
