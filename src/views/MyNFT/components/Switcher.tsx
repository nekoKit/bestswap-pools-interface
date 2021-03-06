import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import capitalize from '../../../utils/capitalize'

export interface SwitcherProps {
  switcherList: Array<string>,
  onChange: (name: string) => void,
}

export interface SwitcherItemProps {
  isActive: boolean,
}

const Switcher: React.FC<SwitcherProps> = (props) => {
  const { switcherList, onChange } = props
  const [activeItem, setActiveItem] = useState('')
  const handleSwitcherItemChange = (name: string) => {
    console.log('Switcher::handleSwitcherItemChange name:', name)
    setActiveItem(name)
    onChange(name)
  }

  useEffect(() => {
    if (switcherList.length) {
      setActiveItem(switcherList[0])
    }
  }, [switcherList])

  return (
    <StyledSwitcherWrapper>
      <StyledSwitcherLine />
      {switcherList.map((item, i) => (
        <StyledSwitcherItem
          key={`switcher-item-${item}-${i}`}
          isActive={activeItem === item.toLowerCase()}
          onClick={() => handleSwitcherItemChange(item.toLowerCase())}
        >
          {capitalize(item)}
        </StyledSwitcherItem>
      ))}
    </StyledSwitcherWrapper>
  )
}

const StyledSwitcherWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
  margin-bottom: 20px;
`

const StyledSwitcherLine = styled.div`
  width: 100%;
  border-bottom: 2px solid rgba(255,255,255,0.6);
  position: absolute;
  bottom: 0;
  z-index: -1;
`

const StyledSwitcherItem = styled.div<SwitcherItemProps>`
  color: ${props => props.isActive ? '#FEC600' : '#E5E5E5'};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  line-height: 1;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.isActive ? '#FEC600' : 'transparent'};
  margin-right: 24px;
  cursor: pointer;
  &:hover {
    color: #FEC600;
    border-color: #FEC600;
  }
`

export default Switcher