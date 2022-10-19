import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import basicNftAbi from "../constants/BasicNft.json"
import marketplaceAbi from "../constants/NftMarketplace.json"
import { Card, Notification, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import UpdateListingModal from "../components/UpdateListingModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

const NftBox = ({ price, seller, tokenId, nftAddress, marketplaceAddress }) => {
    const [imageUri, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)

    const { isWeb3Enabled, account } = useMoralis()

    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const updateUi = async () => {
        // get the tokenURI
        const tokenURI = await getTokenURI()
        console.log(`Token Uri is: ${tokenURI}`)
        // using the image tag from the tokenURI, get the image
        if (tokenURI) {
            // change tokenURI to use an IPFS gateway
            const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            // await fetch request, and then await converting it to json
            const tokenUriResponse = await (await fetch(requestUrl)).json()

            // change image to use an IPFS gateway
            const imageUri = tokenUriResponse.image
            const imageUriUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageUri(imageUriUrl)
            setTokenName(tokenUriResponse.name)
            setTokenDescription(tokenUriResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "You" : truncateStr(seller || "", 15)

    const handleCardClick = () => {
        // if the user who clicks is the owner -> show the modal to update listing
        // otherwise, buyItem stuff ...
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: () => handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait()
        // send a notification about the tx
        dispatch({
            type: "success",
            message: "Transaction successful",
            title: "Item Purchased",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                {imageUri ? (
                    <div className="p-4">
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                nftAddress={nftAddress}
                                marketplaceAddress={marketplaceAddress}
                                onClose={hideModal}
                            />
                            <Card
                                title={tokenName}
                                description={tokenDescription}
                                onClick={handleCardClick}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col items-end">
                                        <div className="italic text-sm">
                                            Owner: {formattedSellerAddress}
                                        </div>
                                        <div>Token #{tokenId}</div>
                                    </div>
                                    <div className="p-2">
                                        <Image
                                            loader={() => imageUri}
                                            src={imageUri}
                                            height="250"
                                            width="250"
                                        />
                                    </div>

                                    <div className="font-bold">
                                        Price: {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div>Loading Image ...</div>
                )}
            </div>
        </div>
    )
}

export default NftBox
