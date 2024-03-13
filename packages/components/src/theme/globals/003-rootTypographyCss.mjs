// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'

export const rootTypographyCss = css`
  :root {
    --base-text-weight-light: 300;
    --base-text-weight-normal: 400;
    --base-text-weight-medium: 500;
    --base-text-weight-semibold: 600;

    --text-codeInline-size: 0.9285em;
    --text-codeBlock-lineHeight: 1.5385;
    --text-codeBlock-size: 0.8125rem;
    --text-caption-lineHeight: 1.3333;
    --text-caption-size: 0.75rem;
    --text-body-lineHeight-small: 1.6666;
    --text-body-lineHeight-medium: 1.4285;
    --text-body-lineHeight-large: 1.5;
    --text-body-size-small: 0.75rem;
    --text-body-size-medium: 0.875rem;
    --text-body-size-large: 1rem;
    --text-subtitle-lineHeight: 1.6;
    --text-subtitle-size: 1.25rem;
    --text-title-lineHeight-small: 1.5;
    --text-title-lineHeight-medium: 1.6;
    --text-title-lineHeight-large: 1.5;
    --text-title-size-small: 1rem;
    --text-title-size-medium: 1.25rem;
    --text-title-size-large: 2rem;
    --text-display-lineHeight: 1.4;
    --text-display-size: 2.5rem;
    --text-display-lineBoxHeight: 3.5rem;
    --fontStack-monospace: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    --fontStack-sansSerif: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    --fontStack-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    --text-codeInline-weight: 400;
    --text-codeBlock-weight: 400;
    --text-caption-weight: 400;
    --text-body-weight: 400;
    --text-subtitle-weight: 400;
    --text-title-weight-small: 600;
    --text-title-weight-medium: 600;
    --text-title-weight-large: 600;
    --text-display-weight: 500;
    --text-codeInline-shorthand: var(--text-codeInline-weight) var(--text-codeInline-size) var(--fontStack-monospace);
    --text-codeBlock-shorthand: var(--text-codeBlock-weight) var(--text-codeBlock-size)/var(--text-codeBlock-lineHeight) var(--fontStack-monospace);
    --text-caption-shorthand: var(--text-caption-weight) var(--text-caption-size)/var(--text-caption-lineHeight) var(--fontStack-sansSerif);
    --text-body-shorthand-small: var(--text-body-weight) var(--text-body-size-small)/var(--text-body-lineHeight-small) var(--fontStack-sansSerif);
    --text-body-shorthand-medium: var(--text-body-weight) var(--text-body-size-medium)/var(--text-body-lineHeight-medium) var(--fontStack-sansSerif);
    --text-body-shorthand-large: var(--text-body-weight) var(--text-body-size-large)/var(--text-body-lineHeight-large) var(--fontStack-sansSerif);
    --text-subtitle-shorthand: var(--text-subtitle-weight) var(--text-subtitle-size)/var(--text-subtitle-lineHeight) var(--fontStack-sansSerif);
    --text-title-shorthand-small: var(--text-title-weight-small) var(--text-title-size-small)/var(--text-title-lineHeight-small) var(--fontStack-sansSerif);
    --text-title-shorthand-medium: var(--text-title-weight-medium) var(--text-title-size-medium)/var(--text-title-lineHeight-medium) var(--fontStack-sansSerif);
    --text-title-shorthand-large: var(--text-title-weight-large) var(--text-title-size-large)/var(--text-title-lineHeight-large) var(--fontStack-sansSerif);
    --text-display-shorthand: var(--text-display-weight) var(--text-display-size)/var(--text-display-lineHeight) var(--fontStack-sansSerif);
  }
`
