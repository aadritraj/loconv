const GH_SOURCE = "https://github.com/aadritraj/loconv";
// attribution for placeholder image
const IMAGE_ATTRIBUTION = "https://unsplash.com/@patrickian4";

export function Footer() {
	return (
		<div className="footer">
			<b>
				<h2>loconv</h2>
			</b>
			<p>distributed under the MIT license</p>
			<p>
				source available{" "}
				<a href={GH_SOURCE} target="_blank" rel="noopener noreferrer">
					here
				</a>
			</p>
			<p>
				placeholder photograph by{" "}
				<a href={IMAGE_ATTRIBUTION} target="_blank" rel="noopener noreferrer">
					Patrick Fore
				</a>{" "}
				licensed under the Unsplash license
			</p>
		</div>
	);
}
