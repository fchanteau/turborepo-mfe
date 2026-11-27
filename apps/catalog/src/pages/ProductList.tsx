import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate } from "react-router";
import { useAuth } from "../auth.ts";
import { products } from "../data.ts";

export function ProductList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Catalog</h1>
      <p className="mb-4 text-sm text-muted-foreground">Welcome, {user.name}. Pick a product below.</p>
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
