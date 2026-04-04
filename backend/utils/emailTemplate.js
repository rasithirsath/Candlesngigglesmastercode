const customerTemplate = (order, pointsData) => `
<div style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0b; padding:40px 0;">

<table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#111;border-radius:10px;overflow:hidden">

<tr>
<td style="background:#000;padding:30px;text-align:center;border-bottom:1px solid #222">
<h1 style="color:#d4af37;margin:0;font-weight:500;letter-spacing:2px">
Gilded Glow Candle Co.
</h1>
<p style="color:#aaa;margin-top:8px">Luxury Candle Experience</p>
</td>
</tr>

<tr>
<td style="padding:40px">

<h2 style="color:#d4af37;margin-bottom:10px"> Order Confirmed</h2>

<p style="color:#ddd;line-height:1.6">
Thank you for your order. Your candle experience has officially begun.
</p>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<h3 style="color:#d4af37;margin-bottom:10px">Order Summary</h3>

<table width="100%" style="color:#ddd">

${order.items
  .map(
    (item) => `
<tr>
<td style="padding:8px 0">
${item.name} × ${item.quantity}
</td>

<td align="right">
₹${item.price}
</td>
</tr>
`,
  )
  .join("")}

</table>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<p style="color:#ddd;font-size:18px">
<strong>Total Paid:</strong> ₹${order.amount}
</p>

<p style="color:#888;font-size:13px">
Payment ID: ${order.razorpayPaymentId}
</p>

<div style="margin-top:20px;padding:16px;border:1px solid #333;border-radius:6px;background:#151515">
<p style="margin:0 0 8px 0;color:#d4af37;font-size:14px"><strong>Shipping Details</strong></p>
<p style="margin:0;color:#ddd;line-height:1.6">
<strong>Address:</strong> ${order.customer?.address || "-"}<br>
<strong>Landmark:</strong> ${order.customer?.landmark || "-"}<br>
<strong>City:</strong> ${order.customer?.city || "-"}<br>
<strong>Pincode:</strong> ${order.customer?.pincode || "-"}
</p>
</div>

${
  pointsData
    ? `
<div style="margin-top:30px;padding:20px;border:1px solid #d4af37;border-radius:6px;background:#151515">

<h3 style="color:#d4af37;margin-top:0"> Reward Points Earned</h3>

<p style="color:#ddd">
You earned <strong>${pointsData.pointsEarned}</strong> Sparks from this purchase.
</p>

<p style="color:#ddd">
Your total Sparks balance is now
<strong>${pointsData.totalPoints}</strong>.
</p>

</div>
`
    : ""
}

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<p style="color:#bbb">
We'll notify you once your candles are shipped 
</p>

</td>
</tr>

<tr>
<td style="background:#000;padding:25px;text-align:center;color:#777;font-size:12px">

<p>Candles & Giggles</p>
<p>Crafted Luxury Candles</p>

</td>
</tr>

</table>
</div>
`;

const adminTemplate = (order) => `
<div style="font-family: Arial, Helvetica, sans-serif;background:#0b0b0b;padding:40px 0">

<table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#111;border-radius:10px;overflow:hidden">

<tr>
<td style="background:#000;padding:30px;text-align:center;border-bottom:1px solid #222">

<h1 style="color:#d4af37;margin:0">
New Order Received
</h1>

<p style="color:#aaa;margin-top:5px">
 Admin Notification
</p>

</td>
</tr>

<tr>
<td style="padding:35px">

<h3 style="color:#d4af37">Customer Details</h3>

<p style="color:#ddd;line-height:1.7">

<strong>Name:</strong> ${order.customer.fullName}<br>
<strong>Email:</strong> ${order.customer.email}<br>
<strong>Phone:</strong> ${order.customer.phone}<br>
<strong>Address:</strong> ${order.customer.address || "-"}<br>
<strong>Landmark:</strong> ${order.customer.landmark || "-"}<br>
<strong>City:</strong> ${order.customer.city || "-"}<br>
<strong>Pincode:</strong> ${order.customer.pincode || "-"}

</p>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<h3 style="color:#d4af37">Items Ordered</h3>

${order.items
  .map(
    (item) => `
<div style="margin-bottom:25px">

<p style="color:#fff;font-size:16px">
<strong>${item.name}</strong>
</p>

<p style="color:#bbb">
Quantity: ${item.quantity}
</p>

<p style="color:#bbb">
Extras: ₹${item.customizationsTotal || 0}
</p>

${
  item.customizations && item.customizations.length > 0
    ? `
<p style="color:#d4af37;margin-top:10px">Customizations</p>

<ul style="color:#ddd;padding-left:20px">

${item.customizations
  .map(
    (c) => `
<li style="margin-bottom:10px">

<strong>${c.name}</strong> – ₹${c.price}

${
  c.id === "labelQuote" && c.message
    ? `<br>
<span style="color:#d4af37">Label Message:</span><br>
<em style="color:#bbb">"${c.message}"</em>`
    : ""
}

${
  c.id === "quotes" && c.message
    ? `<br>
<span style="color:#d4af37">Personalized Message:</span><br>
<em style="color:#bbb">"${c.message}"</em>`
    : ""
}

${
  c.playlist
    ? `<br>
<strong style="color:#d4af37">Spotify Playlist:</strong>
<a href="${c.playlist}" target="_blank" style="color:#1DB954">
Open Playlist
</a>
<br>
<span style="color:#888;font-size:12px">${c.playlist}</span>`
    : ""
}

</li>
`,
  )
  .join("")}

</ul>
`
    : `<p style="color:#777">No customizations</p>`
}

</div>
`,
  )
  .join("")}

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<p style="color:#fff;font-size:18px">
<strong>Total Order Value:</strong> ₹${order.amount}
</p>

<p style="color:#888;font-size:13px">
Payment ID: ${order.razorpayPaymentId}
</p>

</td>
</tr>

<tr>
<td style="background:#000;padding:20px;text-align:center;color:#666;font-size:12px">

<p>Admin Notification • Candles & Giggles</p>

</td>
</tr>

</table>
</div>
`;

module.exports = { customerTemplate, adminTemplate };
