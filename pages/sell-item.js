import { Form } from "@web3uikit/core"
import { useNotification } from "@web3uikit/core"
import { useMoralis } from "react-moralis"
import networkMapping from '../constants/networkMapping.json'

export default function SellItem() {
    const dispatch = useNotification()
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { runContractFunction } = useWeb3Contract()

    const approveAndList = async (data) => {
        console.log("Approving ...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleApproveSuccess = async (nftAddress, tokenId, price) => {
        console.log("Time to list!")
        const listOptions = {
            abi: marketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleListSuccess = async (tx) => {
        await tx.wait(1)
        // send a notification about the tx
        dispatch({
            type: "success",
            message: "Transaction Successful",
            title: "Item Listed",
            position: "topR",
        })
    }

    return (
        <div className="p-4 flex">
            {/* In order to sell, we need the user to define:
            1. Nft address
            2. Token Id
            3. A price
    */}
            <div className="mx-auto w-[600px]">
                <Form
                    buttonConfig={{
                        onClick: function noRefCheck() {},
                        theme: "outline",
                    }}
                    data={[
                        {
                            inputWidth: "100%",
                            name: "NFT Address",
                            type: "text",
                            value: "",
                            validation: {
                                required: true,
                            },
                            key: "nftAddress",
                        },
                        {
                            inputWidth: "50%",
                            name: "TokenId",
                            type: "number",
                            validation: {
                                required: true,
                            },
                            value: "",
                            key: "tokenId",
                        },
                        {
                            inputWidth: "65%",
                            name: "Price ( in ETH )",
                            type: "number",
                            validation: {
                                required: true,
                            },
                            value: "",
                            key: "price",
                        },
                    ]}
                    onSubmit={null}
                    title="Sell an item 🖼"
                />
            </div>
        </div>
    )
}
