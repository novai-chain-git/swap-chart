import styled from 'styled-components'
import { Text } from 'rebass'

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: prop => prop !== 'color'
})`
  color: ${({ color, theme }) => (theme || {})[color]};
  letter-spacing: -0.01em;
`

const HeadingWrapper = styled.h1.withConfig({
  shouldForwardProp: prop => prop !== 'color'
})`
  color: ${({ color, theme }) => (theme || {})[color]};
  font-family: inherit;
  font-weight: 485;
  font-size: ${({ fontSize }) => fontSize};
  margin: ${({ margin }) => margin || 0};
  letter-spacing: -0.02em;
`

export const ThemedText = {
  BodyPrimary(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral1" {...props} />
  },
  BodySecondary(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral2" {...props} />
  },
  BodySmall(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral1" {...props} />
  },
  HeadlineSmall(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={20} lineHeight="28px" color="neutral1" {...props} />
  },
  HeadlineMedium(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={28} color="neutral1" {...props} />
  },
  HeadlineLarge(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={36} lineHeight="44px" color="neutral1" {...props} />
  },
  LargeHeader(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={36} color="neutral1" {...props} />
  },
  Hero(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={48} color="neutral1" {...props} />
  },
  LabelSmall(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral2" {...props} />
  },
  LabelMicro(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={12} color="neutral2" {...props} />
  },
  Caption(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={12} lineHeight="16px" color="neutral1" {...props} />
  },
  Link(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={14} color="accent1" {...props} />
  },
  MediumHeader(props) {
    return <TextWrapper fontWeight={485} fontSize={20} color="neutral1" {...props} />
  },
  SubHeaderLarge(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={20} color="neutral1" {...props} />
  },
  SubHeader(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral1" lineHeight="24px" {...props} />
  },
  SubHeaderSmall(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral2" {...props} />
  },
  H1Small(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <HeadingWrapper fontSize="20px" color="neutral1" {...props} />
  },
  H1Medium(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <HeadingWrapper fontSize="24px" color="neutral1" {...props} />
  },
  H1Large(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <HeadingWrapper fontSize="36px" color="neutral1" {...props} />
  },
  DeprecatedMain(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} color="neutral2" {...props} />
  },
  DeprecatedLink(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} color="accent1" {...props} />
  },
  DeprecatedLabel(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} color="neutral1" {...props} />
  },
  DeprecatedBlack(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} color="neutral1" {...props} />
  },
  DeprecatedWhite(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} color="white" {...props} />
  },
  DeprecatedBody(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral1" {...props} />
  },
  DeprecatedLargeHeader(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={535} fontSize={24} {...props} />
  },
  DeprecatedMediumHeader(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={535} fontSize={20} {...props} />
  },
  DeprecatedSubHeader(props) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <TextWrapper fontWeight={485} fontSize={14} {...props} />
  }
}
