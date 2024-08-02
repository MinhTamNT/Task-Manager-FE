import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app"; // Import kiểu AppProps từ next/app
import "../styles/globals.css"; // Điều chỉnh theo cấu trúc dự án của bạn   
import { createApolloClient } from "../components/configs/ApolloClient";

const client = createApolloClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
