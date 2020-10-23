// import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from '../utils/vest'
import { ACC } from '../constants/acc'

const useNFTBalance = () => {
  const [NFTBalance, setNFTBalance] = useState([0, 0, 0])
  const [approveState, setApproveState] = useState(false)
  const { account, ethereum } = useWallet()

  const contract = useMemo(() => {
    return getContract(
      ethereum as provider,
      '0x9c07A44E2dC4A80d4B4d60e45Dfd5FaA29D283A8',
    )
  }, [ethereum])

  const fetchNFTBalance = useCallback(async () => {
    const balance = await contract.methods
      .balanceOfBatch([account, account, account], [1, 2, 3])
      .call()
    console.log('useNFTBalance::fetchNFTBalance balance:', balance)
    setNFTBalance(balance)
  }, [account, contract.methods])


  const fetchApproveState = useCallback( async () => {
    const approveState = await contract.methods.isApprovedForAll(account, ACC).call()
    console.log('useNFTBalance::fetchApproveState approveState:', approveState)
    setApproveState(approveState)
  },
  [contract.methods, account],
)

  useEffect(() => {
    if (account && contract) {
      fetchNFTBalance()
      fetchApproveState()
    }
  }, [account, contract, fetchNFTBalance, fetchApproveState])

  const nftUri = useCallback(
    async (tokenId: number) => {
      const uri = await contract.methods.uri(tokenId).call()
      console.log('useNFTBalance::nftUri uri:', uri)
      return uri
    },
    [contract.methods],
  )

  const setApprovalForAll = useCallback( async () => {
      await contract.methods.setApprovalForAll(ACC, true).send({ from: account })

      /* const txHash = await call.on('transactionHash', (tx: any) => {
        console.log('NFT::useClaim::setApprovalForAll tx:', tx)
        return tx.transactionHash
      })

      console.log('NFT::useClaim::setApprovalForAll txHash:', txHash) */
    },
    [contract.methods, account],
  )

  console.log('useNFTBalance NFTBalance:', NFTBalance)

  return { NFTBalance, nftUri, setApprovalForAll, approveState }
}

export default useNFTBalance
