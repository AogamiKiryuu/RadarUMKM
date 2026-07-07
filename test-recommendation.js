async function test() {
  // 1. Dapatkan token seolah-olah register/login dulu,
  // tapi mari kita mock session auth di Nuxt atau menggunakan request langsung ke backend jika memungkinkan.
  // Akan lebih mudah jika kita bypass auth sementara di script ini, atau membuat user dummy.
  console.log("Membuat user dummy untuk auth...");
  
  const resReg = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' })
  });
  
  // Ambil cookie dari response login/register
  const cookies = resReg.headers.get('set-cookie');
  console.log("Registration/Login response status:", resReg.status);
  
  let authCookie = cookies;
  if (resReg.status === 400 || resReg.status === 409) { // Kemungkinan email sudah ada, coba login
     const resLogin = await fetch('http://localhost:3000/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
     });
     authCookie = resLogin.headers.get('set-cookie');
     console.log("Login response status:", resLogin.status);
  }

  console.log("\nMencoba hit api recommendations/analyze..");
  const resObj = await fetch('http://localhost:3000/api/recommendations/analyze', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': authCookie
    },
    body: JSON.stringify({
      namaProduk: "Lapis talas bogor rasa keju coklat",
      kategori: "Makanan",
      subKategori: "Kue & Roti",
      hargaProduk: 35000
    })
  });
  
  const data = await resObj.json();
  console.log("Status:", resObj.status);
  console.log("Competitor Count:", data.similarProducts?.length);
  if(data.similarProducts) {
    console.log("Top Competitor Sample:", data.similarProducts.slice(0, 2));
    console.log("Market Analysis Average Price:", data.avgHargaKompetitor);
    console.log("Opportunity Score:", data.scoreLabel, `(${data.score}%)`);
  } else {
    console.log(data);
  }
}
test();
