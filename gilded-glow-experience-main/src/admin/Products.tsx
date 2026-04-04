import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://backend-wghd.onrender.com/api";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  mood?: "happy" | "sad" | "romantic" | "angry";
  collection?: "noor" | "zara" | "rune" | "amara" | "viella" | "quotes";
  burnTime: string;
  isBestSeller?: boolean;
  stock: number;
};

const moodOptions = ["happy", "sad", "romantic", "angry"];
const collectionOptions = ["noor", "zara", "rune", "amara", "viella", "quotes"];

const emptyForm: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  image: "",
  mood: undefined,
  collection: undefined,
  burnTime: "",
  isBestSeller: false,
  stock: 0,
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockDraft, setStockDraft] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Product>(emptyForm);

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data || []);
      const draft: Record<string, number> = {};
      (data || []).forEach((p: Product) => {
        draft[p.id] = p.stock;
      });
      setStockDraft(draft);
    } catch (error) {
      toast.error("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock < 10).length,
    [products],
  );

  const openAddDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingId(product.id);
    setForm(product);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId
        ? `${API_BASE}/products/${editingId}`
        : `${API_BASE}/products`;

      const res = await fetch(endpoint, {
        method,
        headers: authHeaders,
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save product");
      }

      toast.success(editingId ? "Product updated" : "Product created");
      setDialogOpen(false);
      await loadProducts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete product");
      }
      toast.success("Product deleted");
      await loadProducts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const handleStockUpdate = async (id: string) => {
    try {
      const stock = Number(stockDraft[id]);
      if (Number.isNaN(stock) || stock < 0) {
        toast.error("Stock must be 0 or more");
        return;
      }

      const res = await fetch(`${API_BASE}/products/${id}/stock`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ stock }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update stock");
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: data.stock } : p)),
      );
      toast.success("Stock updated");
    } catch (error: any) {
      toast.error(error?.message || "Stock update failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-primary">Inventory Management</h1>
            <p className="text-foreground/60 mt-2">
              {lowStockCount > 0
                ? `${lowStockCount} products are low on stock (< 10).`
                : "All products are sufficiently stocked."}
            </p>
          </div>
          <Button onClick={openAddDialog} variant="heroFilled">
            Add Product
          </Button>
        </div>

        <div className="luxury-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading products...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No products found.</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className={product.stock < 10 ? "bg-red-500/5" : ""}
                  >
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      ₹{Number(product.price || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={stockDraft[product.id] ?? product.stock}
                          onChange={(e) =>
                            setStockDraft((prev) => ({
                              ...prev,
                              [product.id]: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockUpdate(product.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{product.collection || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription>
                Fill product details and save changes to inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="ID"
                value={form.id}
                disabled={!!editingId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, id: e.target.value }))
                }
              />
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
              <Input
                placeholder="Original Price"
                type="number"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    originalPrice: Number(e.target.value),
                  }))
                }
              />
              <Input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              <Input
                placeholder="Burn Time"
                value={form.burnTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, burnTime: e.target.value }))
                }
              />
              <Input
                placeholder="Stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
              />
              <Select
                value={form.mood || "none"}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    mood:
                      value === "none" ? undefined : (value as Product["mood"]),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {moodOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.collection || "none"}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    collection:
                      value === "none"
                        ? undefined
                        : (value as Product["collection"]),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {collectionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="isBestSeller"
                  type="checkbox"
                  checked={!!form.isBestSeller}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isBestSeller: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="isBestSeller"
                  className="text-sm text-foreground/80"
                >
                  Mark as Best Seller
                </label>
              </div>

              <Input
                placeholder="Description"
                className="md:col-span-2"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="heroFilled" onClick={handleSave}>
                {editingId ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Products;
