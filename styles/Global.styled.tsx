import { css, Global } from '@emotion/react';
import React, { ReactElement } from 'react';
import { CrawlerTheme } from '../theme';

import { defaultStyles } from '@hangar31/rc-layout';

export default function GlobalStyled({
  theme,
}: {
  theme: CrawlerTheme;
}): ReactElement {
  return (
    <Global
      styles={css`
        ${defaultStyles}
      `}
    />
  );
}
