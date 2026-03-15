const API = "https://backend-wghd.onrender.com/api";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const getUserCart = async (token: string) => {
  const res = await fetch(`${API}/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const saveUserCart = async (token: string, cart: any) => {
  const res = await fetch(`${API}/user/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cart }),
  });
  if (!res.ok) throw new Error("Failed to save cart");
  return res.json();
};

export const getUserWishlist = async (token: string) => {
  const res = await fetch(`${API}/user/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
};

export const saveUserWishlist = async (token: string, wishlist: any) => {
  const res = await fetch(`${API}/user/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wishlist }),
  });
  if (!res.ok) throw new Error("Failed to save wishlist");
  return res.json();
};
