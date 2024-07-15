import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
 
import './row.css'
import { useBlockClass } from '../../hooks/useBlockClass'

const CSS_HANDLES = ['rowContainer', 'fieldNameCol']

interface Props {
  field: ComparisonField
  showSpecNameWithSpecValue?: boolean
  specName?: boolean
}

const ComparisonFieldRow: StorefrontFunctionComponent<Props> = ({
  field,
  showSpecNameWithSpecValue,
}: Props) => {
  const {handles: cssHandles} = useBlockClass(CSS_HANDLES)


  return field && field.name && field.fieldType && field.showOnSite ? (
    <>
      {showSpecNameWithSpecValue && (
        <div
          className={`${cssHandles.rowContainer} flex flex-row`}
          key={`field-${field.name}`}
        >
          <ExtensionPoint
            id="list-context.comparison-row"
            field={field}
            specName
          />
        </div>
      )}
      <div
        className={`${cssHandles.rowContainer} flex flex-row`}
        data-spec={field.displayValue}
        key={`field-${field.name}`}
      >
        {!showSpecNameWithSpecValue && (
          <div className={`${cssHandles.fieldNameCol} w-100 ma1 pa3`} data-spec={field.displayValue}>
            <span>{field.displayValue}</span>
          </div>
        )}

        <ExtensionPoint id="list-context.comparison-row" field={field} />
      </div>
    </>
  ) : null
}

export default ComparisonFieldRow
