import { Modal, Input, useNotification } from "@web3uikit/core"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

const UpdateListingModal = ({ tokenId, nftAddress, isVisible, marketplaceAddress, onClose }) => {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        // send a notification about the tx
        dispatch({
            type: "success",
            message: "Transaction successful",
            title: "Item Updated",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith(0)
    }

    const { runContractFunction: updateItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateItem",
        params: {
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    return (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={() =>
                    updateItem({
                        onError: (error) => console.log(error),
                        onSuccess: handleUpdateListingSuccess,
                    })
                }
            >
                <Input
                    label="Update listing price (in ETH)"
                    name="New listing price"
                    type="number"
                    onChange={(event) => {
                        setPriceToUpdateListingWith(event.target.value)
                    }}
                ></Input>
            </Modal>
        </div>
    )
}

export default UpdateListingModal
