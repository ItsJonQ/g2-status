import { HStack, Text, View } from "@wp-g2/components";
import { ui } from "@wp-g2/styles";
import { percentage } from "@lib/utils";

function ProgressBar(props) {
	const {
		color = ui.get("colorGreen500"),
		progress,
		width = "100%",
		height = 8,
	} = props;

	const value = isNaN(progress) ? 0 : progress;
	const barWidth = percentage(value);

	return (
		<HStack>
			<View
				role="progressbar"
				aria-valuenow={value}
				aria-valuemin={0}
				aria-valuemax={100}
				css={{
					backgroundColor: "rgba(0, 0, 0, 0.04)",
					borderRadius: 8,
					height,
					width,
					overflow: "hidden",
				}}
			>
				<View
					css={{
						borderRadius: 8,
						backgroundColor: color,
						transition: "width 0.2s ease",
						height: "100%",
					}}
					style={{
						width: barWidth,
					}}
				/>
			</View>
			<Text variant="muted" size={10}>
				{barWidth}
			</Text>
		</HStack>
	);
}

export default ProgressBar;
