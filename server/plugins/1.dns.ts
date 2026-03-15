import dns from 'node:dns';

export default defineNitroPlugin(() => {
  if (dns && dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
    console.log('✅ [Nitro Plugin] Konfigurasi Node DNS disetel ke ipv4first untuk mengatasi masalah fetch timeout di Railway.');
  }
});
