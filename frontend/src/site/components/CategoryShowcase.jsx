import CategoryCard from "./CategoryCard";
import "./CategoryShowcase.css";

function CategoryShowcase({ categories }) {
    const [featured, ...rest] = categories;

    return (
        <section className="category-showcase site-container">
            <h2>Kategoriler</h2>

            <div className="category-showcase-grid">
                {featured && (
                    <div className="category-showcase-featured">
                        <CategoryCard category={featured} size="large" />
                    </div>
                )}

                <div className="category-showcase-stack">
                    {rest.map((category) => (
                        <CategoryCard key={category.id} category={category} size="small" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoryShowcase;
