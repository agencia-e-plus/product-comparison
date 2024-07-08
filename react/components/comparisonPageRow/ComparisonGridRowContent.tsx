import type { ReactChildren, ReactChild } from 'react'
import React, { useMemo } from 'react'
import { pathOr } from 'ramda'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { ProductListContext } from 'vtex.product-list-context'
import { useCssHandles } from 'vtex.css-handles'

import ProductSummeryListEventCaller from '../productSummaryList/ProductSummeryListEventCaller'
import ComparisonContext from '../../ProductComparisonContext'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonFieldValue from './ComparisonFieldValue'
import './row.css'

const CSS_HANDLES = [
  'comparisonCol',
  'comparisonColName',
  'fieldNameCol',
  'title',
]

interface Props {
  field: ComparisonField
  children: ReactChildren | ReactChild
  products: Product[]
  comparisonProducts: ProductToCompare[]
  specName?: boolean
  groupName?: string
}

const List = ({
  children,
  comparisonProducts,
  field,
  specName,
  groupName,
}: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { list } = useListContext()

  const newListContextValue = useMemo(() => {
    const componentList =
      comparisonProducts &&
      comparisonProducts.map((comparisonProduct) => {
        return groupName ? (
          <div className={`${cssHandles.title} pa5 b`}>
            <span>{groupName}</span>
          </div>
        ) : specName ? (
          <div
            key={`${comparisonProduct.productId}-col`}
            className={`${cssHandles.comparisonColName} w-100 ma1 pa3`}
          >
            <div className={`${cssHandles.fieldNameCol} w-100 ma1 pa3`}>
              <span>{field.displayValue}</span>
            </div>
          </div>
        ) : (
          <div
            key={`${comparisonProduct.productId}-col`}
            className={`${cssHandles.comparisonCol} w-100 ma1 pa3`}
          >
            <ComparisonFieldValue
              field={field}
              productToCompare={comparisonProduct}
            />
          </div>
        )
      })

    return list.concat(componentList)
  }, [
    comparisonProducts,
    cssHandles.comparisonCol,
    cssHandles.comparisonColName,
    cssHandles.fieldNameCol,
    cssHandles.title,
    field,
    groupName,
    list,
    specName,
  ])

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const ComparisonGridRowContent = ({
  children,
  field,
  specName,
  groupName,
}: Props) => {
  const { ProductListProvider } = ProductListContext
  const { useProductComparisonState } = ComparisonContext
  const { useComparisonProductState } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const productData = useComparisonProductState()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  return (
    <ProductListProvider listName="row-content">
      <List
        products={products}
        comparisonProducts={comparisonProducts}
        field={field}
        specName={specName}
        groupName={groupName}
      >
        {children}
      </List>
      <ProductSummeryListEventCaller />
    </ProductListProvider>
  )
}

export default ComparisonGridRowContent
