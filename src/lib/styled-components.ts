/**
 * Note: we're deprecating styled-components in favor of Tamagui, which you
 * should import from `ui/src`. It should cover most of what styled-components
 * handles.
 *
 * If not, you can bail to using either $platform-web style prop or inline style
 * tag, or we can add on any one-off CSS by either inlining a style tag in the
 * component itself, or importing it via CSS modules.
 */

import styledFn from 'styled-components'

/** @deprecated use `styled` from `ui/src` instead */
export default styledFn

export * from 'styled-components'
