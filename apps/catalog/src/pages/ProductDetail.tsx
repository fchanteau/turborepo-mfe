import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate, useParams } from "react-router";
import { findProduct } from "../data.ts";

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = findProduct(productId);
  const back = () => navigate("..", { relative: "path" });

  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product not found</CardTitle>
          <CardDescription>No product matches “{productId}”.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={back}>Back to catalog</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.price} €</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2">
        <p className="text-muted-foreground">{product.description}</p>
        <Badge variant={product.inStock ? "secondary" : "destructive"}>
          {product.inStock ? "In stock" : "Out of stock"}
        </Badge>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={back}>
          ← Back
        </Button>
        <Button disabled={!product.inStock}>Add to cart — {product.price} €</Button>
      </CardFooter>
    </Card>
  );
}
