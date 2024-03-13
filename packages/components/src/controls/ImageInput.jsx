// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import styled from 'styled-components'
import { cssInput } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import classnames from 'classnames'


export const ImageInput = React.forwardRef(({
    name,
    value,
    width = '250px',
    error: errorProp,
    form,
    accept = ['image/jpeg', 'image/png', 'image/webp'],
    onChange,
    onClear
  }, ref) => {

  const inputRef = React.useRef(null)

  const [reader] = React.useState(new FileReader())

  const [error, setError] = React.useState(errorProp)

  React.useEffect(() => {
    function onLoadedFunc() {
      if(reader.readyState === FileReader.DONE) {
        onChange({ data: reader.result })
      }
    }

    reader.addEventListener('loadend', onLoadedFunc)

    return () => reader.removeEventListener('loadend', onLoadedFunc)
  }, [reader])

  const onChangeInner = React.useCallback((e) => {
    setError(undefined)
    if(e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0])
    }
  }, [onChange, reader])

  const mRefs = useMergeRefs([ref, inputRef])

  return (
    <Root $width={width} data-testid={`Imageinput-${name}-root`} className={classnames({error})}>
      {
        value
          ? (
              <Preview>
                <Img $width={width} src={value} alt='Product image' />
                <Clear onClick={onClear}>x</Clear>
              </Preview>
            )
          : (
              <>
                <StyledImageInput
                  id="imageinput"
                  type="file"
                  data-testid={`imageinput-${name}-input`}
                  key={`${name}`}
                  ref={mRefs}
                  name={name}
                  $width={width}
                  onChange={onChangeInner}
                  autoCorrect='no'
                  autoComplete='no'
                  accept={accept.join(',')}
                  form={form}
                />
                { error && <Error data-testid={`Imageinput-${name}-error`}>{error}</Error> }
              </>
            )
      }
    </Root>
  )
})

const Root = styled.div`
  position: relative;
  width: ${({$width}) => $width};

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const StyledImageInput = styled.input`
  ${cssInput}
  // letter-spacing: 2px;
  width: ${({$width}) => $width};
  text-align: left;
  z-index: 10;
`

const Preview = styled.div`
  position: relative;
  width: fit-content;
`

const Clear = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
`

const Img = styled.img`
  width: ${({ $width }) => $width };
  border-radius: 4px;
  border: 1px solid #ccc;
`

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
  margin-top: -4px;
`

ImageInput.displayName = 'ImageInput'
