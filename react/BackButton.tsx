import React from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'

const CSS_HANDLES = ['backButtonWrapper']

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

type Props = InjectedIntlProps

const RemoveAllButton: React.FC<Props> = ({ intl }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const onBackButtonClick = () => {
    window.history.back()
  }

  return (
    <div className={cssHandles.backButtonWrapper}>
      <Button variation="tertiary" size="regular" onClick={onBackButtonClick}>
        {intl.formatMessage(messages.backToProducts)}
      </Button>
    </div>
  )
}

export default injectIntl(RemoveAllButton)
