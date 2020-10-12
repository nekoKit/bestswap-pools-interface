import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import useBlock from './useBlock'
import useFarms from './useFarms'
import { getContract, getTotalLPWbnbValue } from '../utils/pool'
import { getContract as getERC20Contract } from '../utils/erc20'
import { Farm } from '../contexts/Farms/types'
import useBest from './useBest'
import useWBNB from './useWBNB'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [ farms ] = useFarms()
  // const wethContact = getWethContract(sushi)
  const block = useBlock()
  const { address: bestAddress } = useBest()
  const { address: wbnbAddress } = useWBNB()

  const fetchAllStakedValue = useCallback(async () => {
    const _farms = farms.map((farm: Farm) => {
      const { poolAddress, stakingTokenAddress, pid } = farm
      const poolContract = getContract(ethereum, poolAddress) // masterChefContract
      const wbnbContract = getERC20Contract(ethereum, wbnbAddress) // wethContract
      const stakingContract = getERC20Contract(ethereum, stakingTokenAddress) // lpContract
      const bestContract = getERC20Contract(ethereum, bestAddress) // tokenContract

      return getTotalLPWbnbValue(poolContract, wbnbContract, stakingContract, bestContract, pid)
      // totalAllocPoint = new BigNumber(totalAllocPoint).plus(new BigNumber(allocPoint))
      // const poolWeight = new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
    })
    // let totalAllocPoint = new BigNumber(0)
    const balances: Array<StakedValue> = await Promise.all(_farms)

    setBalance(balances)
  }, [bestAddress, ethereum, farms, wbnbAddress])

  useEffect(() => {
    if (account) {
      fetchAllStakedValue()
    }
  }, [account, block, fetchAllStakedValue, setBalance])

  return balances
}

export default useAllStakedValue
