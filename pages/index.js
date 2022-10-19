import { useQuery } from "@apollo/client"
import { useMoralis } from "react-moralis"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import networkMapping from "../constants/networkMapping.json"
import NftBox from "../components/NFTBox"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    if (listedNfts) {
        console.log(listedNfts)
    }
    if (error) {
        console.log(`Error: ${error.message}`)
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="p-4 flex flex-col items-center">
                <h1 className="text-blue-900 py-4 px-4 font-bold text-xl tracking-wider border-b-2 border-stone-100 mb-6">
                    Recent Listings
                </h1>
                <div className="flex flex-wrap">
                    {isWeb3Enabled ? (
                        loading || !listedNfts ? (
                            <div>Loading ...</div>
                        ) : (
                            listedNfts.activeItems.map((nft) => {
                                console.log(nft)
                                const {price, seller, tokenId, nftAddress} = nft
                                return (
                                    <div>
                                        <NftBox
                                            price={price}
                                            seller={seller}
                                            tokenId={tokenId}
                                            nftAddress={nftAddress}
                                            marketplaceAddress={marketplaceAddress}
                                            key={`${nftAddress}${tokenId}`}
                                        />
                                    </div>
                                )
                            })
                        ) 
                    ) : (
                        <div className="flex flex-col justify-center items-center mt-6">
                            <p className="py-4 text-lg italic">Please Connect Your Wallet!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
