import { ExternalLink } from "./external-link";

const GH_SOURCE = "https://github.com/aadritraj/loconv";
// attribution for placeholder image
const IMAGE_ATTRIBUTION = "https://unsplash.com/@patrickian4";

export function Footer() {
  return (
    <div className="footer">
      <section>
        <h2>loconv</h2>
        <p className="text-light text-small">{__COMMIT_HASH__}</p>
      </section>
      <section>
        <p>distributed under the MIT license</p>
        <ExternalLink href={GH_SOURCE}>source available</ExternalLink>
      </section>
      <section>
        <p>placeholder photograph provided under the unsplash license by</p>
        <ExternalLink href={IMAGE_ATTRIBUTION}>Patrick Fore</ExternalLink>
      </section>
    </div>
  );
}
