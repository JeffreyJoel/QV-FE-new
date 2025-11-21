import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: 'https://qv-fe.vercel.app',
  icons: ['https://avatars.mywebsite.com/']
}

// Create wagmi config
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [baseSepolia]
})

export const config = wagmiAdapter.wagmiConfig

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata,
  features: {
    analytics: true
  }
})

export const queryClient = new QueryClient()

