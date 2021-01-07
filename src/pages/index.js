import Head from "next/head";
import _ from "lodash";
import {
	Container,
	Card,
	Grid,
	FlexBlock,
	Heading,
	HStack,
	Icon,
	Link,
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
	ViewportPhablet,
	CardBody,
	Text,
	VStack,
	View,
} from "@wp-g2/components";
import { ui, css, ThemeProvider } from "@wp-g2/styles";
import { useData } from "@hooks/useData";
import { ProgressBar } from "@components/index";
import {
	FiCpu,
	FiSettings,
	FiBox,
	FiCodesandbox,
	FiLoader,
	FiLayers,
} from "react-icons/fi";

function getPackageSections(data) {
	return Object.entries(data).map(([slug, items]) => {
		const extraProps = packagesProps[slug] || {};
		const totalScore = items.length * 2;
		const currentScore = items.reduce((sum, i) => sum + i.score, 0);
		const status = currentScore / totalScore;

		return {
			...extraProps,
			slug,
			status,
			totalScore,
			currentScore,
			key: slug,
			title: _.startCase(slug),
			items,
		};
	});
}

const progressMessages = [
	`We're just getting started!`,
	`We're on our way!`,
	`We're getting there!`,
	`We're almost there!`,
	`We're so close!`,
	`We're super close!`,
	`We did it!`,
];

function getProgressMessage(statusRaw) {
	let message = progressMessages[0];

	switch (true) {
		case statusRaw > 0.11:
			message = progressMessages[1];
			break;
		case statusRaw > 0.26:
			message = progressMessages[2];
			break;
		case statusRaw > 0.65:
			message = progressMessages[3];
			break;
		case statusRaw > 0.76:
			message = progressMessages[4];
			break;
		case statusRaw > 0.9:
			message = progressMessages[5];
			break;
		case statusRaw >= 1:
			message = progressMessages[6];
			break;
	}

	return message;
}

function StatusHeader({ statusRaw }) {
	const isReady = statusRaw >= 1;
	const message = getProgressMessage(statusRaw);

	return (
		<VStack spacing={4}>
			<VStack spacing={1}>
				<Text lineHeight={1} size={[18, 21]} weight={600}>
					Is it integrated into Gutenberg yet?
				</Text>
				<Text
					lineHeight={1}
					size={[64, 80]}
					weight={800}
					css={{ letterSpacing: -1 }}
				>
					{isReady ? "Yup!" : "Not Yet."}
				</Text>
			</VStack>
			<VStack>
				<ProgressBar progress={statusRaw} height={12} />
				<Text lineHeight={1} variant="muted" weight={600}>
					{message}
				</Text>
			</VStack>
		</VStack>
	);
}

const packagesProps = {
	substate: {
		icon: <FiCpu />,
		backgroundColor: ui.get("colorIndigo50"),
		color: ui.get("colorIndigo500"),
	},
	utils: {
		icon: <FiSettings />,
		backgroundColor: ui.get("colorPink50"),
		color: ui.get("colorPink500"),
	},
	"create-styles": {
		icon: <FiBox />,
		backgroundColor: ui.get("colorYellow50"),
		color: ui.get("colorYellow500"),
	},
	styles: {
		icon: <FiCodesandbox />,
		backgroundColor: ui.get("colorBlue50"),
		color: ui.get("colorBlue500"),
	},
	context: {
		icon: <FiLoader />,
		backgroundColor: ui.get("colorRed50"),
		color: ui.get("colorRed500"),
	},
	components: {
		icon: <FiLayers />,
		backgroundColor: ui.get("colorGreen50"),
		color: ui.get("colorGreen500"),
	},
};

function PackageHeader(props) {
	const { backgroundColor, icon, color, title, status, ...otherProps } = props;
	return (
		<CardBody {...otherProps} css={{ cursor: "pointer" }}>
			<HStack spacing={3}>
				<View
					css={{
						backgroundColor,
						borderRadius: 8,
						padding: 8,
						color,
						width: 32,
						height: 32,
					}}
				>
					<Icon icon={icon} size={16} color={color} />
				</View>
				<View>
					<Text weight={600}>{title}</Text>
				</View>
				<FlexBlock />
				<View css={{ paddingRight: 8 }}>
					<ProgressBar width={120} progress={status} color={color} />
				</View>
			</HStack>
		</CardBody>
	);
}

const collectionItemHoverStyles = css`
	> * {
		transition: opacity 0.16s linear;
	}
	&:hover > * {
		opacity: 0.5;

		&:hover {
			opacity: 1;
		}
	}
`;

function PackageItem(props) {
	const {
		description,
		moduleName,
		progressValue,
		backgroundColor,
		color,
	} = props;
	return (
		<Grid
			templateColumns="180px minmax(0,1fr) 100px"
			css={[
				{ borderRadius: 8, padding: 8, marginLeft: 12 },
				ui.hover({
					background: ui.color("black").setAlpha(0.04).toRgbString(),
				}),
			]}
		>
			<View>
				<Text weight={500} size={12} isBlock>
					{moduleName}
				</Text>
			</View>
			<View>
				<ViewportPhablet>
					<Text truncate variant="muted" size={12}>
						{description}
					</Text>
				</ViewportPhablet>
			</View>
			<HStack alignment="right">
				<ProgressBar
					width={60}
					progress={progressValue}
					backgroundColor={backgroundColor}
					color={color}
				/>
			</HStack>
		</Grid>
	);
}

function CardLink({
	title,
	href,
	caption,
	backgroundColor = ui.get("colorBlue500"),
}) {
	return (
		<Card
			as="a"
			href={href}
			css={{
				background: backgroundColor,
				textDecoration: "none",
			}}
			target="_blank"
			rel="noreferrer noopener"
			isBorderless
			elevation={5}
		>
			<CardBody css={{ height: 120, padding: 20 }}>
				<VStack alignment="center" expanded>
					<VStack spacing={1}>
						<Text css={{ opacity: 0.6 }} upperCase size={10} weight={600}>
							{caption}
						</Text>
						<Heading>{title}</Heading>
					</VStack>
				</VStack>
			</CardBody>
		</Card>
	);
}

function PackageSection(props) {
	const { backgroundColor, color, icon, title, status, items } = props;

	return (
		<Card isBorderless elevation={5}>
			<Collapsible>
				<CollapsibleTrigger
					as={PackageHeader}
					backgroundColor={backgroundColor}
					color={color}
					icon={icon}
					status={status}
					title={title}
				/>
				<CollapsibleContent>
					<View
						css={[
							{ paddingRight: 12, paddingBottom: 8 },
							collectionItemHoverStyles,
						]}
					>
						{items.map((item) => (
							<PackageItem key={item.moduleName} {...item} color={color} />
						))}
					</View>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}

export default function Home() {
	const data = useData();

	const {
		overview: { statusRaw },
		groupedItems,
	} = data;

	const packageSections = getPackageSections(groupedItems);

	return (
		<View>
			<Head>
				<title>G2 Components: Integration Status</title>
				<meta name="viewport" content="width=device-width, minimum-scale=1.0" />
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="description"
					content="G2 Component Development and Integration Status."
				/>
			</Head>
			<Container
				width={860}
				css={{ padding: ["40px 20px 10vh", "8vh 20px 10vh"] }}
			>
				<VStack spacing={12}>
					<View>
						<Text weight={800} as="h1">
							G2 Components
						</Text>
					</View>
					<StatusHeader statusRaw={statusRaw} />
					<VStack spacing={2}>
						{packageSections.map((packageSection) => (
							<PackageSection {...packageSection} />
						))}
					</VStack>
					<ThemeProvider isDark>
						<Grid columns={[1, 2]} gap={[4, 8]}>
							<CardLink
								title="Gutenberg Proposal"
								caption="The Next Component System"
								href="https://github.com/WordPress/gutenberg/issues/27331"
								backgroundColor={ui.get("colorBlue500")}
							/>
							<CardLink
								title="Project Blog"
								caption="Get The Latest"
								href="https://g2components.wordpress.com/"
								backgroundColor={ui.get("colorGreen500")}
							/>
						</Grid>
					</ThemeProvider>
					<HStack alignment="center" spacing={2}>
						<Text size="caption">
							Built with{" "}
							<Link
								href="https://github.com/itsjonq/g2"
								size="caption"
								target="_blank"
								rel="noreferrer noopener"
							>
								G2 Components
							</Link>
						</Text>
						<Text size="caption">.</Text>
						<Link
							href="https://github.com/ItsJonQ/g2-status"
							size="caption"
							target="_blank"
							rel="noreferrer noopener"
						>
							View Source
						</Link>
					</HStack>
				</VStack>
			</Container>
		</View>
	);
}
