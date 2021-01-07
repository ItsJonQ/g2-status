import Head from 'next/head';
import { Heading, Text, VStack, View } from '@wp-g2/components';
import { ui } from '@wp-g2/styles';

export default function Home() {
	return (
		<View>
			<Head>
				<title>G2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<VStack
				alignment="center"
				css={[ui.padding(4), ui.frame.height('80vh')]}
			>
				<VStack css={[ui.frame.width(640), ui.alignment.center]}>
					<Heading size={1}>
						<span aria-label="wave" role="img">
							👋
						</span>{' '}
						Hello
					</Heading>
					<Text>
						Welcome to the G2 Components Next.js Starter Kit!
					</Text>
					<Text size="caption" variant="muted">
						Start editing to see some magic happen!
					</Text>
				</VStack>
			</VStack>
		</View>
	);
}
