const profile = await Profile.findOne({ email }).lean();
console.log("Login email:", email);
console.log("Profile found:", !!profile);
console.log("Profile email:", profile?.email);
console.log("Profile Found:", !!profile);
console.log("Profile Email:", profile?.email);