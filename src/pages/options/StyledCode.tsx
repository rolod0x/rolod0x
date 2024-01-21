import { ReactNode } from 'react';
import { alpha, styled } from '@mui/material/styles';

import './Donate.css';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function StyledCode({ children, className }: Props) {
  const Code = styled('code')(
    ({ theme }) =>
      `
        color: ${theme.palette.secondary.light};
        border-color: ${alpha(theme.palette.secondary.dark, 0.5)};
        margin: 2px 4px;
      `,
  );
  return <Code {...{ className }}>{children}</Code>;
}
