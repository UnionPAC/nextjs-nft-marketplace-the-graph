// how to do a graph query
// using apollo client - https://www.npmjs.com/package/@apollo/client

import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

const GraphExample = () => {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)

    if(loading) return "Loading ..."
    if(error) {
        console.log(`Error: ${error.message}`)
    }

    console.log(data)

    return (
        <div className="flex justify-center">
            <h1>How to query a subgraph 🚀</h1>
        </div>
    )
}

export default GraphExample;