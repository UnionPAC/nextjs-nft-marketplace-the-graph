import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NotificationProvider } from "@web3uikit/core"
import Header from "../components/Header"
import "../styles/globals.css"

const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/36526/nft-marketplace/v0.0.3",
    cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="Buy and sell your favourite nft's!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
