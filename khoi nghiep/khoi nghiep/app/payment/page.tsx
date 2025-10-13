'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { BrowserProvider, JsonRpcProvider, parseEther } from 'ethers'

const DEFAULT_PAYMENT_ADDRESS = '0xab1710a5D125211b4BE27c439E05C5b3259Aec9C'
const INFURA_MAINNET_RPC = 'https://mainnet.infura.io/v3/df8716592db443e5b71a83b58cb2e191'

type PackageName = 'Gov' | 'Edu' | 'Pro'

const PACKAGE_PRICES_ETH: Record<Exclude<PackageName, 'Gov'>, number> = {
  Edu: 0.01,
  Pro: 0.05,
}

function PaymentPageContent() {
  const params = useSearchParams()
  const pkg = (params.get('pkg') as PackageName) || 'Edu'

  const [isPaying, setIsPaying] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [rpcBlockNumber, setRpcBlockNumber] = useState<number | null>(null)

  const isFree = pkg === 'Gov'
  const amountEth = useMemo(() => (isFree ? 0 : PACKAGE_PRICES_ETH[pkg as 'Edu' | 'Pro'] || 0), [pkg, isFree])
  const toAddress = useMemo(() => process.env.NEXT_PUBLIC_PAYMENT_ADDRESS || DEFAULT_PAYMENT_ADDRESS, [])

  useEffect(() => {
    if (isFree) {
      toast('Gói miễn phí, không cần thanh toán')
    }
  }, [isFree])

  // Read-only provider linked to the provided Infura RPC URL
  useEffect(() => {
    const provider = new JsonRpcProvider(INFURA_MAINNET_RPC)
    provider
      .getBlockNumber()
      .then((bn) => setRpcBlockNumber(Number(bn)))
      .catch(() => setRpcBlockNumber(null))
  }, [])

  const ensureMainnet = async () => {
    const anyWindow = window as any
    if (!anyWindow.ethereum) return false
    try {
      // Query current chain
      const provider = new BrowserProvider(anyWindow.ethereum)
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
      if (Number(network.chainId) === 1) return true
      // Attempt to switch to mainnet
      await anyWindow.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
      const after = await provider.getNetwork()
      setChainId(Number(after.chainId))
      return Number(after.chainId) === 1
    } catch (switchErr) {
      // Try adding Ethereum mainnet with the provided Infura RPC as a fallback
      try {
        await anyWindow.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x1',
              chainName: 'Ethereum Mainnet',
              rpcUrls: [INFURA_MAINNET_RPC],
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              blockExplorerUrls: ['https://etherscan.io'],
            },
          ],
        })
        // Switch again after adding
        await anyWindow.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        })
        const provider = new BrowserProvider(anyWindow.ethereum)
        const after = await provider.getNetwork()
        setChainId(Number(after.chainId))
        return Number(after.chainId) === 1
      } catch {
        return false
      }
    }
  }

  const connectWallet = async () => {
    try {
      const anyWindow = window as any
      if (!anyWindow.ethereum) {
        toast.error('Không tìm thấy ví.')
        return
      }
      const provider = new BrowserProvider(anyWindow.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setWalletAddress(address)
      const ok = await ensureMainnet()
      if (!ok) {
        toast.error('Vui lòng chuyển mạng ví sang Ethereum Mainnet (chainId 1).')
      } else {
        toast.success('Đã kết nối ví')
      }
    } catch (e) {
      toast.error('Kết nối ví thất bại')
    }
  }

  const handlePay = async () => {
    if (isFree) {
      toast('Gói miễn phí, không cần thanh toán')
      return
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
      toast.error('Địa chỉ thanh toán không hợp lệ')
      return
    }
    try {
      setIsPaying(true)
      const anyWindow = window as any
      if (!anyWindow.ethereum) {
        toast.error('Không tìm thấy ví. Vui lòng cài MetaMask.')
        return
      }
      const provider = new BrowserProvider(anyWindow.ethereum)
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
      if (Number(network.chainId) !== 1) {
        const ok = await ensureMainnet()
        if (!ok) {
          toast.error('Cần chuyển mạng sang Ethereum Mainnet để thanh toán.')
          return
        }
      }
      const signer = await provider.getSigner()
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: parseEther(String(amountEth)),
      })
      toast.loading('Đang xử lý thanh toán...', { id: 'pay' })
      await tx.wait()
      toast.success('Thanh toán thành công!', { id: 'pay' })
    } catch (e) {
      toast.error('Thanh toán thất bại')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-semibold">ViLaw</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Thanh toán</span>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">Quay lại Trang chủ</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán gói dịch vụ</h1>
          <p className="text-gray-600 mb-6">Ethereum Mainnet qua MetaMask</p>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="package-select" className="block text-sm font-medium text-gray-700 mb-1">Gói</label>
              <select
                id="package-select"
                className="w-full border rounded-lg px-3 py-2"
                value={pkg}
                onChange={(e) => window.location.replace(`/payment?pkg=${e.target.value}`)}
              >
                <option value="Gov">Gov (Miễn phí)</option>
                <option value="Edu">Edu (0.01 ETH)</option>
                <option value="Pro">Pro (0.05 ETH)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Số tiền</div>
                <div className="text-lg font-semibold">{amountEth} ETH</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Địa chỉ nhận</div>
                <div className="text-sm font-mono break-all">{toAddress}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Ví</div>
                <div className="text-sm font-mono break-all">{walletAddress || 'Chưa kết nối'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Mạng</div>
                <div className="text-sm">{chainId ? `ChainId ${chainId}` : 'Chưa xác định'}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={connectWallet}
                className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium"
              >
                Kết nối ví
              </button>
              <button
                onClick={handlePay}
                disabled={isPaying || isFree}
                className={`px-5 py-3 rounded-lg font-medium ${
                  isFree
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } ${isPaying ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isFree ? 'Gói miễn phí' : isPaying ? 'Đang thanh toán...' : 'Thanh toán'}
              </button>
            </div>

            <div className="text-xs text-gray-500">
              RPC: {INFURA_MAINNET_RPC}
              {rpcBlockNumber !== null && (
                <span className="ml-2">(block #{rpcBlockNumber})</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}> 
      <PaymentPageContent />
    </Suspense>
  )
}
