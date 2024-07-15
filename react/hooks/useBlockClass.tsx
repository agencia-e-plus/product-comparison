import { useCssHandles } from 'vtex.css-handles'
import type {
  CssHandlesList,
  ValuesOf,
} from 'vtex.css-handles/react/CssHandlesTypes'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

type CssHandles<T extends readonly string[]> = Record<ValuesOf<T>, string>
type WithModifiers<T extends CssHandlesList> = (
  handleName: ValuesOf<T>,
  ...modifiers: ClassValue[]
) => string
type CssHandlesBag<T extends CssHandlesList> = {
  handles: CssHandles<T>
  withModifiers: WithModifiers<T>
}

type FormatToGlobalClass = { classname: string; vendorToReplace: RegExp }

type UseBlockClassOptions = {
  vtexClass?: boolean
}

const GENERATE_VTEX_CLASSES = false

const formatToGlobalClass = ({
  classname,
  vendorToReplace,
}: FormatToGlobalClass) => {
  const globalClassname = classname
    .replace(vendorToReplace, 'vtex')
    .replace(/[0-9]+-x-/g, '')

  return `${classname} ${globalClassname}`
}

export const useBlockClass = <T extends readonly string[]>(
  cssHandles: T,
  rawOptions?: UseBlockClassOptions
): CssHandlesBag<T> => {
  const options: UseBlockClassOptions = {
    vtexClass: GENERATE_VTEX_CLASSES,
    ...(rawOptions ?? {}),
  }

  const { handles: oldHandles, withModifiers: oldWithModifiers } =
    useCssHandles(cssHandles)

  if (!options.vtexClass) {
    return {
      handles: oldHandles,
      withModifiers: (handleName: ValuesOf<T>, ...modifiers: ClassValue[]) =>
        oldWithModifiers(handleName, clsx(modifiers).split(' ')),
    }
  }

  const [vendor] = (Object.values(oldHandles)[0] as string).split('-')
  const vendorToReplace = new RegExp(vendor, 'g')

  const handles = cssHandles.reduce((acc, key: ValuesOf<typeof cssHandles>) => {
    const classname = oldHandles[key]

    acc[key] = formatToGlobalClass({
      classname,
      vendorToReplace,
    })

    return acc
  }, {} as CssHandles<T>)

  const withModifiers = (
    handleName: ValuesOf<T>,
    ...modifiers: ClassValue[]
  ) => {
    return oldWithModifiers(handleName, clsx(modifiers).split(' '))
      .split(' ')
      .map((classname: string) =>
        formatToGlobalClass({ classname, vendorToReplace })
      )
      .join(' ')
  }

  return {
    handles,
    withModifiers,
  }
}
