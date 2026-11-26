import { Badge, Button, Card } from "@repo/ui";
import { useNavigate, useParams } from "react-router";
import { products } from "../data.ts";

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);
  const back = () => navigate("..", { relative: "path" });

  if (!product) {
    return (
      <Card title="Product not found" footer={<Button onClick={back}>Back to catalog</Button>}>
        No product matches “{productId}”.
      </Card>
    );
  }

  return (
    <Card
      title={product.name}
      footer={
        <>
          <Button variant="ghost" onClick={back}>
            ← Back
          </Button>
          <Button disabled={!product.inStock}>Add to cart — {product.price} €</Button>
        </>
      }
    >
      <p className="mb-2">{product.description}</p>
      <Badge tone={product.inStock ? "success" : "warning"}>{product.inStock ? "In stock" : "Out of stock"}</Badge>
    </Card>
  );
}
