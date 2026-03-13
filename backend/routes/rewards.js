const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const Redemption = require("../models/rewardRedemption");
const sendMail = require("../utils/sendmail");
const unlockExperienceTemplate = (user, experienceName, sparksUsed) => `
<div style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0b; padding:40px 0;">
<table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#111;border-radius:10px;overflow:hidden">

<tr>
<td style="background:#000;padding:30px;text-align:center;border-bottom:1px solid #222">
<h1 style="color:#d4af37;margin:0;letter-spacing:2px">Gilded Glow Candle Co.</h1>
<p style="color:#aaa;margin-top:8px">Members Experience Unlocked</p>
</td>
</tr>

<tr>
<td style="padding:40px">

<h2 style="color:#d4af37;margin-bottom:10px">✨ Experience Unlocked</h2>

<p style="color:#ddd;line-height:1.6">
Congratulations. You’ve unlocked a premium experience from the Giggle Archive.
</p>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<div style="background:#151515;border:1px solid #d4af37;border-radius:6px;padding:25px">

<h3 style="color:#d4af37;margin-top:0">${experienceName}</h3>

<p style="color:#bbb;margin:8px 0">
<strong>Sparks Redeemed:</strong> ${sparksUsed}
</p>

<p style="color:#bbb;margin:8px 0">
<strong>Remaining Sparks:</strong> ${user.rewardPoints}
</p>

</div>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<p style="color:#ddd">
Our team will process your experience shortly.
</p>

</td>
</tr>

<tr>
<td style="background:#000;padding:20px;text-align:center;color:#666;font-size:12px">
<p>Gilded Glow Candle Co.</p>
</td>
</tr>

</table>
</div>
`;
const adminUnlockTemplate = (user, experienceName, sparksUsed) => `
<div style="font-family: Arial, Helvetica, sans-serif;background:#0b0b0b;padding:40px 0">

<table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#111;border-radius:10px;overflow:hidden">

<tr>
<td style="background:#000;padding:30px;text-align:center;border-bottom:1px solid #222">

<h1 style="color:#d4af37;margin:0">
New Experience Redemption
</h1>

<p style="color:#aaa;margin-top:5px">
Gilded Glow Admin Notification
</p>

</td>
</tr>

<tr>
<td style="padding:35px">

<h3 style="color:#d4af37">User Information</h3>

<p style="color:#ddd;line-height:1.7">

<strong>User Email:</strong> ${user.email}<br>
<strong>User ID:</strong> ${user._id}

</p>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<h3 style="color:#d4af37">Experience Details</h3>

<p style="color:#ddd">

<strong>Experience:</strong> ${experienceName}

</p>

<p style="color:#ddd">

<strong>Sparks Redeemed:</strong> ${sparksUsed}

</p>

<p style="color:#ddd">

<strong>Remaining User Sparks:</strong> ${user.rewardPoints}

</p>

<hr style="border:none;border-top:1px solid #333;margin:30px 0">

<p style="color:#aaa;font-size:13px">
This notification confirms that a member unlocked a premium experience.
</p>

</td>
</tr>

<tr>
<td style="background:#000;padding:20px;text-align:center;color:#666;font-size:12px">

<p>Admin Panel • Gilded Glow Candle Co.</p>

</td>
</tr>

</table>
</div>
`;

router.post("/redeem", auth, async (req, res) => {
  try {
    const { experienceName, sparksRequired } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ Prevent duplicate redemption
    const existingRedemption = await Redemption.findOne({
      userId: req.user.id,
      experienceName,
    });

    if (existingRedemption) {
      return res.status(400).json({
        success: false,
        message: "You already unlocked this experience",
      });
    }

    // ❌ Check sparks balance
    if (user.rewardPoints < sparksRequired) {
      return res.status(400).json({
        success: false,
        message: "Not enough sparks",
      });
    }

    // ⭐ Deduct sparks
    user.rewardPoints -= sparksRequired;

    // ⭐ Update Tier Logic
    if (user.rewardPoints >= 10000 && user.tier < 3) {
      user.tier = 3;
    } else if (user.rewardPoints >= 4000 && user.tier < 2) {
      user.tier = 2;
    }

    await user.save();

    // 🗂 Save redemption
    const redemption = await Redemption.create({
      userId: user._id,
      experienceName,
      sparksUsed: sparksRequired,
    });

    // 📧 Send USER email
    await sendMail({
      to: user.email,
      subject: "✨ Experience Unlocked — Gilded Glow",
      html: unlockExperienceTemplate(user, experienceName, sparksRequired),
    });

    // 📧 Send ADMIN email
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Experience Redemption – Gilded Glow",
      html: adminUnlockTemplate(user, experienceName, sparksRequired),
    });

    // ✅ Final response
    res.json({
      success: true,
      message: "Experience unlocked successfully",
      remainingPoints: user.rewardPoints,
      redemption,
    });
  } catch (error) {
    console.error("❌ Redemption error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/my-redemptions", auth, async (req, res) => {
  try {
    const redemptions = await Redemption.find({
      userId: req.user.id,
    });

    const experiences = redemptions.map((r) => r.experienceName);

    res.json({
      success: true,
      experiences,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch redemptions",
    });
  }
});

module.exports = router;
