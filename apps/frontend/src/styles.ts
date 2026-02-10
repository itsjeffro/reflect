import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    --border: #d8d8d8;
    --bg-primary: #0190ff;

    --btn-secondary: #f9fafe;
    --btn-secondary-hover: #edeff5;

    --text-default: #222;
    --text-primary: #0190ff;
    --text-danger: #ff0101;
  }

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
    color: var(--text-default);
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

    li:before {
      top: 2px;
    }

    li:after {
      top: 5px;
    }
  }

  .editor__toolbar button {
    height: 28px;

    svg {
      height: 16px !important;
    }
  }
`;
