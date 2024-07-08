/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line prettier/prettier
import type { MouseEvent } from 'react'
import React, { useState, useEffect } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Checkbox, withToast } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { usePixel } from 'vtex.pixel-manager'

import ComparisonContext from '../../ProductComparisonContext'

const CSS_HANDLES = ['productSelectorContainer']

const messages = defineMessages({
  product: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product',
  },
  added: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product-added',
  },
  removed: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product-removed',
  },
  compare: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.compare',
  },
  comparisonUpperLimit: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.upper-limit-exceeded',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}
const getContextValue = (
  productContext: unknown,
  productSummaryContext: unknown
) => {
  const contextValue =
    productSummaryContext !== undefined ? productSummaryContext : productContext

  const productId = pathOr('', ['product', 'productId'], contextValue)
  const productName = pathOr('', ['product', 'productName'], contextValue)
  const itemId = pathOr('', ['selectedItem', 'itemId'], contextValue)
  const link = pathOr('', ['product', 'link'], contextValue)

  return { productName, productId, itemId, link }
}

const ProductSelector = ({ showToast, intl }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const [isChecked, setIsChecked] = useState(false)
  const valuesFromContext = useProductSummary()
  const valuesFromProductContext = useProduct()
  const { productId, productName, itemId, link } = getContextValue(
    valuesFromProductContext,
    valuesFromContext
  )

  const { useProductComparisonState, useProductComparisonDispatch } =
    ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()
  const { push } = usePixel()

  const isDrawerCollapsed = pathOr(false, ['isDrawerCollapsed'], comparisonData)
  const productsSelected = pathOr([], ['products'], comparisonData)
  const maxItemsToCompare = pathOr(
    0,
    ['maxNumberOfItemsToCompare'],
    comparisonData
  )

  useEffect(() => {
    const selectedProducts =
      productId && itemId
        ? find(
            allPass([propEq('productId', productId), propEq('skuId', itemId)])
          )(productsSelected)
        : []

    setIsChecked(selectedProducts && !isEmpty(selectedProducts))
  }, [productsSelected, itemId, productId])

  const showMessage = (message: string, show = true) => {
    if (showToast && show) {
      showToast({
        message,
      })
    }
  }

  const productSelectorChanged = (e: { target: { checked: boolean } }) => {
    if (e.target.checked && productsSelected.length === maxItemsToCompare) {
      setIsChecked(false)
      push({
        id: 'much-products',
      })
      showMessage(`${intl.formatMessage(messages.comparisonUpperLimit)}`, true)
    } else if (e.target.checked) {
      dispatchComparison({
        args: {
          product: { productId, skuId: itemId, link },
        },
        type: 'ADD',
      })
      showMessage(
        `${intl.formatMessage(
          messages.product
        )} "${productName}" ${intl.formatMessage(messages.added)}`,
        isDrawerCollapsed
      )
    } else {
      dispatchComparison({
        args: {
          product: { productId, skuId: itemId, link },
        },
        type: 'REMOVE',
      })
      showMessage(
        `${intl.formatMessage(
          messages.product
        )} "${productName}" ${intl.formatMessage(messages.removed)}`,
        isDrawerCollapsed
      )
    }
  }

  const productSelectionOnClicked = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={productSelectionOnClicked}
      className={`${cssHandles.productSelectorContainer} mb3`}
    >
      <Checkbox
        checked={isChecked}
        id={`${productId}-${itemId}-product-comparison`}
        label={intl.formatMessage(messages.compare)}
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorChanged}
        value={isChecked}
      />
    </div>
  )
}

export default withToast(injectIntl(ProductSelector))
