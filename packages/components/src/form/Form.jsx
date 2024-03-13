// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { noop } from 'lodash-es'
import { isNil } from 'lodash-es'
import { uniqueId } from 'lodash-es'
import { has } from 'lodash-es'
import { get } from 'lodash-es'
import { isFunction } from 'lodash-es'
import { isNotBlank } from '@pickestry/utils'
import { useForm } from './useForm.mjs'
import { Alert } from '../Alert.jsx'
import { SubmitButton } from '../buttons/index.mjs'

export function Form({
  id,
  entity,
  children,
  testId,
  testid,
  focus = false,
  submitClean = false,
  inline = false,
  multi = false,
  submitText = 'Accept',
  onSubmit,
  onCancel,
  onReset,
  onDestroy = noop,
  onDirty = noop,
  onSuccess,
  onFailed,
  style
}) {

  const ref = React.useRef()

  const refFirstEl = React.useRef()

  const finalId = React.useMemo(() => id || `id_${uniqueId()}`, [])

  const overlayId = React.useMemo(() => `overlay-${finalId}`, [finalId])

  const [error, setError] = React.useState()

  const {
    getModel,
    isDirty,
    reset,
    errors,
    clearErrors
  } = useForm({id: finalId, entity })

  const model = React.useMemo(() => getModel(finalId), [finalId, getModel])

  React.useLayoutEffect(() => {
    if(focus && !isNil(refFirstEl.current)) {
      refFirstEl.current.focus()
    }
  }, [])

  const disableForm = React.useCallback(() => {
    if(!isNil(ref.current)) {
      const {
        left,
        bottom,
        top,
        right,
        width,
        height
      } = ref.current.getBoundingClientRect()

      const overlay = document.createElement('div')
      overlay.id = overlayId
      overlay.style.backgroundColor = 'white'
      overlay.style.opacity = '0.3'
      overlay.style.setProperty('z-index', '1000')
      overlay.style.position = 'fixed'
      overlay.style.left = `${left}px`
      overlay.style.bottom = `${bottom}px`
      overlay.style.right = `${right}px`
      overlay.style.top = `${top}px`
      overlay.style.width = `${width}px`
      overlay.style.height = `${height}px`

      ref.current.appendChild(overlay)
    }
  }, [finalId])

  const enableForm = React.useCallback(() => {
    const overlay = document.getElementById(overlayId)
    if(overlay && !isNil(overlay.parentNode))
    overlay.parentNode?.removeChild(overlay)
  }, [finalId])

  // clean up
  React.useEffect(() => {
    return function cleanup() {
      if(!isNotBlank(finalId) && isFunction(onDestroy)) {
        onDestroy(finalId)
      }
    }
  }, [finalId])

  const dirty = React.useMemo(() => isDirty(finalId), [isDirty, finalId, model])

  React.useEffect(() => {
    if(finalId && isFunction(onDirty)) {
      onDirty(dirty, finalId)
    }
  }, [finalId, dirty])

  const submitForm = React.useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    clearErrors()

    setError(undefined)

    if((dirty || submitClean) && isFunction(onSubmit)) {
      disableForm()

      onSubmit(model, finalId)
        .then(() => {
          onSuccess?.()
          console.log('successfully submitted!') // eslint-disable-line no-console
        })
        .catch((err) => {
          console.log('failed to submit') // eslint-disable-line no-console
          const { message } = err
          setError(message)
          onFailed?.(message)
        })
        .finally(() => {
          enableForm()
        })
    }
  }, [finalId, model, dirty, disableForm, enableForm])

  const nothingToSubmit = React.useMemo(() => {
    if(submitClean) return false

    return !dirty
  }, [dirty, submitClean])

  return (
    <React.Profiler id={`form-prof-${finalId}`} onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => { // eslint-disable-line no-unused-vars
      // console.log(`${id} on ${phase} -> (st: %s, ct: %s) d: %s`, startTime, commitTime, actualDuration)
      // console.log('actual duration: %s ms', actualDuration)
      // console.log('  base duration: %s ms', baseDuration)
      // console.log('     start time: %s ms', startTime)
      // console.log('    commit time: %s ms', commitTime)
      // console.log('   interactions: ', interactions)
    }} >
      <StyledForm id={'js-form-' + finalId}
          $inline={inline}
          data-testid={testid || testId}
          ref={ref}
          style={style}
          onSubmit={submitForm}
          onReset={reset}>
            { error && <Alert message={error} type='danger' onClose={() => { setError(undefined) }} />  }
            {
              React.Children.map(children,
                (child, i) => {
                  if(!React.isValidElement(child)) return child

                  const newProps = {...child.props}
                  if(i === 0) {
                    newProps.ref = (node) => {
                      refFirstEl.current =  node?.nodeName === 'INPUT' ? node : node?.querySelector('input')
                    }
                  }
                  if(errors && has(errors, child.props.name)) {
                    newProps.error = get(errors, child.props.name)
                  }
                  newProps.form = finalId

                  return React.cloneElement(child, newProps)
                }
              )
            }
            {
              !multi && (
                <>
                  {onSubmit ? <SubmitButton value={submitText} disabled={nothingToSubmit} /> : null}
                  {onCancel ? <input type="button" value="Cancel" onClick={onCancel} /> : null }
                  {onReset  ? <input type="reset" value="Reset" disabled={!nothingToSubmit} /> : null }
                </>
              )
            }
      </StyledForm>
    </React.Profiler>
  )
}

const StyledForm = styled.form`
  display: ${({$inline}) => $inline ? 'flex' : 'block'};
  padding: ${({$inline}) => $inline ? '0' : '8px'};

  > input[type="button"] {
    margin: ${({$inline}) => $inline ? '0 0 0 4px' : '15px 0 0 0'};
  }

  > input[type="reset"] {
    margin: ${({$inline}) => $inline ? '0 0 0 4px' : '15px 0 0 0'};
  }

  > input[type="submit"] {
    margin: ${({$inline}) => $inline ? '0 0 0 4px' : '16px 8px 0 0'};
  }
`

Form.displayName = 'Form'
