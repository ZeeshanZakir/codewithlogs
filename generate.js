const profile = await Profile.findOne({ email }).lean();

console.log("Profile Found:", !!profile);
console.log("Profile Email:", profile?.email);