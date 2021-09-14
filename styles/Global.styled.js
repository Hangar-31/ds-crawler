import { css, Global } from '@emotion/react';
import React from 'react';

import { defaultStyles } from '@hangar31/rc-layout';

export default function GlobalStyled({ theme }) {
  return (
    <Global
      styles={css`
        ${defaultStyles}
      `}
    />
  );
}
