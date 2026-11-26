import { Badge, Button, Card } from "@repo/ui";
import { useNavigate } from "react-router";
import { products } from "../data.ts";

export function ProductList() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Catalog</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.name}
            footer={
              <>
                <Badge tone={product.inStock ? "success" : "warning"}>
                  {product.inStock ? "In stock" : "Out of stock"}
                </Badge>
                <Button variant="secondary" onClick={() => navigate(product.id)}>
                  Details
                </Button>
              </>
            }
          >
            {product.description}
          </Card>
        ))}
      </div>
    </section>
  );
}
