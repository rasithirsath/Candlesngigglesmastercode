const API = "http://localhost:5000/api";

const testUser = {
  name: "AI Test User",
  email: "ai-test+user@example.com",
  password: "password123",
};

async function http(path, opts = {}) {
  const res = await fetch(API + path, opts);
  const txt = await res.text();
  try {
    return { ok: res.ok, status: res.status, json: JSON.parse(txt) };
  } catch {
    return { ok: res.ok, status: res.status, text: txt };
  }
}

async function signup() {
  return http("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
}

async function login() {
  return http("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });
}

async function getCart(token) {
  return http("/user/cart", { headers: { Authorization: `Bearer ${token}` } });
}

async function saveCart(token, cart) {
  return http("/user/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cart }),
  });
}

async function run() {
  console.log("1) Signing up (if not exists)");
  const s = await signup();
  console.log(" signup:", s.status, s.ok, s.json || s.text || "");

  console.log("2) Logging in");
  const l = await login();
  if (!l.ok) {
    console.error("Login failed", l);
    process.exit(1);
  }
  const token = l.json.token;
  console.log(" token acquired for user id", l.json.user.id);

  console.log("3) Fetch initial cart (should be empty or server state)");
  const c1 = await getCart(token);
  console.log(" initial cart:", JSON.stringify(c1.json || c1.text));

  console.log("4) Save a test cart to server");
  const testCart = [
    { id: "1", name: "Crimson Romance", price: 500, quantity: 2 },
  ];
  const ssave = await saveCart(token, testCart);
  console.log(" save result:", ssave.status, ssave.ok);

  console.log("5) Fetch cart after save");
  const c2 = await getCart(token);
  console.log(" saved cart:", JSON.stringify(c2.json || c2.text));

  console.log("6) Simulate logout (discard token), then login again");
  const l2 = await login();
  if (!l2.ok) {
    console.error("Relogin failed", l2);
    process.exit(1);
  }
  const token2 = l2.json.token;
  console.log(" re-login token acquired");

  console.log("7) Fetch cart after re-login (should contain saved items)");
  const c3 = await getCart(token2);
  console.log(" re-login cart:", JSON.stringify(c3.json || c3.text));

  const hasItems = Array.isArray(c3.json?.cart) && c3.json.cart.length > 0;
  console.log("\nTest result: cart persisted across logout/login?", hasItems);
  process.exit(hasItems ? 0 : 2);
}

run().catch((e) => {
  console.error("ERROR", e);
  process.exit(1);
});
