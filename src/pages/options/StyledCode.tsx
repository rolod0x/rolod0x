import { ReactNode } from 'react';
import { alpha, styled } from '@mui/material/styles';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function StyledCode({ children, className }: Props) {
  const Code = styled('code')(
    ({ theme }) =>
      `
        font-family: Ubuntu Mono;
        margin: 2px 4px;
        padding: 2px;
        color: ${theme.palette.secondary.light};
        border-color: ${alpha(theme.palette.secondary.dark, 0.5)};
        border-width: 1px;
        border-radius: 4px;
        border-style: solid;
      `,
  );
  return <Code {...{ className }}>{children}</Code>;
}
