import { ThemeProvider } from "@wp-g2/styles";
import theme from "@lib/theme";
import "../styles/global.css";

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider theme={theme} isGlobal />
			<Component {...pageProps} />
		</>
	);
}
