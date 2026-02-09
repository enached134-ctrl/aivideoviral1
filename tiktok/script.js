// Initialize Supabase
const supabaseUrl = 'https://lexfvbzfvfevpllrlofn.supabase.co';
const supabaseKey = 'sb_publishable_VC0rykj3sd7jlMJL4IDV6w_Juo8qDdk';
// Verificăm dacă există deja
if (typeof supabaseClient === "undefined") {
  var supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
}


// restul codului JS


// Preview poza încărcată
function previewFile() {
  const preview = document.getElementById('preview');
  const file = document.getElementById('userFile').files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
}

// Submit formular + upload + Stripe
async function submitForm() {
  const email = document.getElementById('userEmail').value;
  const file = document.getElementById('userFile').files[0];

  if (!email || !file) {
    alert("Completează email și încarcă poza!");
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert("Tip de fișier nepermis! Folosește doar JPG, PNG sau WEBP.");
    return;
  }

  // Stripe deschis la click
  window.open("https://buy.stripe.com/5kQ5kFai8gSiaDFgi2abK00", "_blank");

  // Upload imagine în Supabase
  const { data: storageData, error: storageError } = await supabase
    .storage
    .from('user-images')
    .upload(`images/${Date.now()}_${file.name}`, file);

  if (storageError) {
    console.error(storageError);
    alert("Eroare la upload");
    return;
  }

  const { publicURL } = supabase
    .storage
    .from('user-images')
    .getPublicUrl(storageData.path);

  const { data, error } = await supabase
    .from('user_uploads')
    .insert([{ email: email, image_url: publicURL }]);

  if (error) {
    console.error(error);
    alert("Eroare la salvarea datelor");
    return;
  }

  document.getElementById('successMsg').style.display = 'block';
}
