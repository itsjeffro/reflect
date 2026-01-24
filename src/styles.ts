import { css } from '@emotion/react';

export const globalStyles = css`
  *, *:before, *:after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #root {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .editor {
    padding: 0;
    font-size: 14px;

    &__content-editable {
      padding-left: 0;
      padding-right: 0;
    }

    ul {
      padding: 0 0 0 1rem;
      margin: 0;
      font-size: 14px;
    }

    p, li {
      margin-top: 0;
    }
  }
`;
