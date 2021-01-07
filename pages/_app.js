import { ThemeProvider } from '@wp-g2/styles';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider />
			<Component {...pageProps} />
		</>
	);
}
