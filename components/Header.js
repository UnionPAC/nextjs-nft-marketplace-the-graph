import Link from "next/link"
import { ConnectButton } from "@web3uikit/web3"

const Header = () => {
    return (
        <nav className="mb-6 flex flex-col items-center mt-7">
            <h1 className="text-4xl font-bold pb-8 text-blue-900">NFT Marketplace</h1>
            <ul className="flex space-x-12">
                <li className="text-lg font-bold border-b-2 border-transparent hover:border-b-2 hover:border-stone-200">
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li className="text-lg font-bold border-b-2 border-transparent hover:border-b-2 hover:border-stone-200">
                    <Link href="/sell-item">
                        <a>Sell</a>
                    </Link>
                </li>
            </ul>
            <div className="fixed top-6 right-6 z-10">
                <ConnectButton />
            </div>
        </nav>
    )
}

export default Header
