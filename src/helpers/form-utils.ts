/* eslint-disable no-console */
export function insertText(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): boolean {
  try {
    element.focus()
    element.select()
    const tracker = (element as any)._valueTracker
    if (tracker) {
      tracker.setValue('')
    }

    const success = document.execCommand('insertText', false, value)

    if (success) {
      if (tracker) {
        tracker.setValue(value)
      }
      return true
    }

    return false
  } catch (error) {
    console.error('insertText failed:', error)
    return false
  }
}

export interface SetTextareaOptions {
  focusToEnd?: boolean
  debug?: boolean
}

export function setTextareaValue(
  element: HTMLTextAreaElement,
  value: string,
  options: SetTextareaOptions = {},
): void {
  const { focusToEnd = true, debug = false } = options

  if (debug) {
    console.debug(`Setting textarea value: "${value}"`)
  }

  const success = insertText(element, value)

  if (!success) {
    if (debug) {
      console.debug('execCommand failed, using fallback')
    }

    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  if (focusToEnd) {
    element.focus()
    setTimeout(() => {
      element.selectionStart = element.selectionEnd = value.length
    }, 0)
  }

  if (debug) {
    console.debug(`Textarea value set successfully: "${element.value}"`)
  }
}

export function setInputValue(
  element: HTMLInputElement,
  value: string,
  options: SetTextareaOptions = {},
): void {
  const { focusToEnd = true, debug = false } = options

  if (debug) {
    console.debug(`Setting input value: "${value}"`)
  }

  const success = insertText(element, value)

  if (!success) {
    if (debug) {
      console.debug('execCommand failed, using fallback')
    }

    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  if (focusToEnd) {
    element.focus()
    setTimeout(() => {
      element.selectionStart = element.selectionEnd = value.length
    }, 0)
  }

  if (debug) {
    console.debug(`Input value set successfully: "${element.value}"`)
  }
}
