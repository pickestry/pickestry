import styled from 'styled-components'

const colors = [
  '#C8102E',
  '#D79FC7',
  '#ECEBBD',
  '#45B1E8',
  '#330072',
  '#45B5AA',
  '#FFEB00',
  '#EA871E',
  '#AFE313',
  '#132C2D'
]

const MOD = colors.length - 1

export const CircleMark = styled.div`
  margin: 5px auto;
  width: 10px;
  height: 10px;
  clip-path: circle(4px);
  background: ${({ $code = MOD }) => colors[+$code % MOD]};
`

