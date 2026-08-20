import "./SitePageHeader.css";

function SitePageHeader({ eyebrow, title, description }) {
    return (
        <section className="site-page-header site-container">
            {eyebrow && <span className="site-page-header-eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            {description && <p>{description}</p>}
        </section>
    );
}

export default SitePageHeader;
