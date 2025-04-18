import React, { useState, useEffect, ComponentType, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
//border: 1px solid #e8e8e8;

const TableTitle = styled.div`
  font-size: 16px;
  padding: 0 20px;
  padding-bottom: 14px;
  font-family: 'OrbitronMedium';
  @media (max-width: 768px) {
    font-size: 18px;
    padding-bottom: 8px;
  }
`

const TableHeadDev = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
`
const TableBodyDev = styled.div`
  width: 100%;
  overflow: auto;
  max-height: 528px;
`

const Table = styled.table`
  width: 100%;
  border-spacing: 0px;
  /* overflow: hidden; */
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  //background: ${({ theme }) => theme.bg2};
 
  color: #999;
`
const TableTr = styled.tr`
  height: 50px;
  border-top: 1px solid ${({ theme }) => theme.border1};
`
const TableTh = styled.th`
  position: relative;
  font-weight: 400;
`
const TableBody = styled.tbody`
  //background: ${({ theme }) => theme.bg3};
`

const TableTd = styled.td`
  text-align: center;
`

const FilterDropdownCom = styled.div`
  .filter-dropdown {
    position: absolute;
    border-radius: 10px;
    left: 0;
    top: 100%;
    background: ${({ theme }) => theme.bg3};
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    width: 100%;
  }
  .filter-item {
    padding: 4px 16px;
    display: flex;
    justify-content: space-between;
  }
`

interface FiltersType {
  lable: string
  value: any
}

export interface ColumnsType {
  lable?: string
  dataIndex: any
  render?: any
  filters?: FiltersType[]
  header?: () => React.ReactNode
  column?: () => React.ReactNode
  style?: any
}
interface TableProps {
  columns: ColumnsType[]
  dataSource: any[]
  title?: string,
  height?: number | string,
  maxHeight?: number | string,
  onReachBottom?: () => void,
  page?: Boolean
}

export const TableTdComponent = function({ value }: { value: any }) {
  return <TableTd>{value}</TableTd>
}

const FilterDropdownComs = function({ row }: { row: ColumnsType }) {
  return (
    <>
      <FilterDropdownCom>
        {row.lable}
        {/* value-
        <div className="filter-dropdown">
            {row.filters?.map((item, index) => (
              <div className="filter-item" key={index}>{item.lable}</div>  
            ))}
        </div> */}
      </FilterDropdownCom>
    </>
  )
}

export const TableComponent = function({ height,maxHeight, columns, dataSource, title = '',
  onReachBottom = () =>{}, page = false
 }: TableProps) {
 const { t, i18n } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return

    // 滚动到底部判断
    const isBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) < 10
    if (isBottom) {
      onReachBottom()
      console.log('到底了，触发加载更多')
      // 触发你想执行的函数，比如加载数据
    }
  }

  const getDataSource = dataSource
  const TableHeaderComponent = function() {
    return (
      <TableHeader>
        <TableTr>
          {columns.map((item, index) => (
            <TableTh key={index} style={item.style ? item.style : {}}>
              {/* {item.filters ? <FilterDropdownComs row={item} /> : item.lable} */}
              {item.filters ? <FilterDropdownComs row={item} /> : item.header ? item.header() : item.lable}
            </TableTh>
          ))}
        </TableTr>
      </TableHeader>
    )
  }

  const TableBodyComponent = function() {
    return (
      <TableBody>
        {dataSource.map((item, index) => (
          <TableTr key={index}>
            {columns.map((items, key) => (
              <TableTdComponent
                key={key}
                value={
                  items.render
                    ? items.render({ row: item, index: index })
                    : item.column
                    ? item.column({ row: item, index: index })
                    : item[items.dataIndex]
                }
              />
            ))}
          </TableTr>
        ))}
      </TableBody>
    )
  }

  return (
    <>
      {title && <TableTitle>{title}</TableTitle>}
      <TableHeadDev style={{ height, maxHeight:maxHeight }}
      ref={scrollRef}
      onScroll={handleScroll}>
        <Table>
          <TableHeaderComponent />
          <TableBodyComponent />
        </Table>
        {page && <div style={{textAlign:'center',padding:'20px'}}>
          {t('loading')}
          </div>}
      </TableHeadDev>
      {/* <TableBodyDev>
        <Table>
          
        </Table>
      </TableBodyDev> */}
    </>
  )
}
