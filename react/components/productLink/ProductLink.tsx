/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { withToast } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'

import ComparisonContext from '../../ProductComparisonContext'
import { Link } from 'vtex.render-runtime'

const CSS_HANDLES = ['ProductLinkContainer', 'ProductLinkLabel']

const messages = defineMessages({
  see: {
    defaultMessage: '',
    id: 'store/product-comparison.product-link.see',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}
const ProductLink = ({  intl }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const {
    useProductComparisonState,
  } = ComparisonContext

  const {products}= useProductComparisonState()

  if(!products.length) return null

  return (
    <Link
      to={products[0].link}
      className={`${cssHandles.ProductLinkContainer} mb3`}
    >
      <span className={cssHandles.ProductLinkLabel}>{intl.formatMessage(messages.see)}</span>
    </Link>
  )
}

export default withToast(injectIntl(ProductLink))
