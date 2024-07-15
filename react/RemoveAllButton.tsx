import React from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { Button, withToast } from 'vtex.styleguide'

import ComparisonContext from './ProductComparisonContext'
import { useBlockClass } from './hooks/useBlockClass'

const CSS_HANDLES = ['removeAllItemsButtonWrapper']

const messages = defineMessages({
  removeAll: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all',
  },
  removeAllMessage: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all-message',
  },
  backToProducts: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.back-to-products',
  },
  sortBy: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.sort-by',
  },
  orderAdded: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.order-added',
  },
  title: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.title',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}

const RemoveAllButton: React.FC<Props> = ({ intl, showToast }) => {
  const {handles: cssHandles} = useBlockClass(CSS_HANDLES)


  const { useProductComparisonDispatch } = ComparisonContext

  const dispatchComparison = useProductComparisonDispatch()

  const showMessage = (message: string) => {
    if (showToast) {
      showToast({
        message,
      })
    }
  }

  const removeAllItems = () => {
    dispatchComparison({
      type: 'REMOVE_ALL',
    })
    showMessage(intl.formatMessage(messages.removeAllMessage))
    window.history.back()
  }

  return (
    <div className={cssHandles.removeAllItemsButtonWrapper}>
      <Button variation="tertiary" size="regular" onClick={removeAllItems}>
        {intl.formatMessage(messages.removeAll)}
      </Button>
    </div>
  )
}

export default withToast(injectIntl(RemoveAllButton))
