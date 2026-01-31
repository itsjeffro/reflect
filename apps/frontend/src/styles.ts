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

  :root {
    --border: #d8d8d8;
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

    &__toolbar > div {
      margin: 0;
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

  .editor__toolbar button {
    height: 28px;

    svg {
      height: 16px !important;
    }
  }
`;
