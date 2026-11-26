import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate } from "react-router";
import { products } from "../data.ts";

export function ProductList() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-4 font-heading text-2xl font-bold tracking-tight">Catalog</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.price} €</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-muted-foreground">{product.description}</CardContent>
            <CardFooter className="justify-between">
              <Badge variant={product.inStock ? "secondary" : "destructive"}>
                {product.inStock ? "In stock" : "Out of stock"}
              </Badge>
              <Button variant="outline" onClick={() => navigate(product.id)}>
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
