// const fetch = require('node-fetch'); // Native fetch used
// If node-fetch is not available, we can use http/https modules but that's verbose. 
// Let's assume Node 18+ which has global fetch.

const API_URL = 'http://localhost:5000/api';

async function verify() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    console.log(`1. Signing up user: ${email}`);
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    if (!signupRes.ok) {
        console.error('Signup failed:', await signupRes.text());
        process.exit(1);
    }
    const signupData = await signupRes.json();
    const token = signupData.token;
    console.log('✅ Signup successful. Token received.');

    console.log('2. Fetching initial cart (should be empty)');
    const cartRes1 = await fetch(`${API_URL}/user/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const cartData1 = await cartRes1.json();
    if (cartData1.cart.length !== 0) {
        console.error('❌ Cart should be empty, but has items:', cartData1.cart);
        process.exit(1);
    }
    console.log('✅ Initial cart is empty.');

    console.log('3. Adding item to cart');
    const item = { id: '1', name: 'Test Candle', price: 100, quantity: 1 };
    const saveCartRes = await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: [item] })
    });
    if (!saveCartRes.ok) {
        console.error('❌ Failed to save cart:', await saveCartRes.text());
        process.exit(1);
    }
    console.log('✅ Item added to cart.');

    console.log('4. Verifying cart persistence (fetching again)');
    const cartRes2 = await fetch(`${API_URL}/user/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const cartData2 = await cartRes2.json();
    if (cartData2.cart.length !== 1 || cartData2.cart[0].id !== '1') {
        console.error('❌ Cart persistence failed. Expected 1 item, got:', cartData2.cart);
        process.exit(1);
    }
    console.log('✅ Cart persistence verified.');

    console.log('5. Simulating Logout & Login');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    const newToken = loginData.token;
    console.log('✅ Login successful. New token received.');

    console.log('6. Verifying cart after re-login');
    const cartRes3 = await fetch(`${API_URL}/user/cart`, {
        headers: { 'Authorization': `Bearer ${newToken}` }
    });
    const cartData3 = await cartRes3.json();
    if (cartData3.cart.length !== 1 || cartData3.cart[0].id !== '1') {
        console.error('❌ Cart lost after re-login. Expected 1 item, got:', cartData3.cart);
        process.exit(1);
    }
    console.log('✅ Cart restored after login!');

    console.log('🎉 ALL CHECKS PASSED');
}

verify().catch(err => console.error(err));
