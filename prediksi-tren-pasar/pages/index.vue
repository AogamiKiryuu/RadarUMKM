<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Prediksi Tren Pasar</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Sistem Prediksi Daya Tarik Produk Khas Bogor</p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="form.email" type="email" placeholder="email@example.com" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput v-model="form.password" type="password" placeholder="********" :disabled="loading" />
          </UFormGroup>

          <div>
            <UButton type="submit" block :loading="loading" size="lg"> Sign In </UButton>
          </div>

          <div class="text-center">
            <UButton variant="link" @click="showRegister = !showRegister" :disabled="loading">
              {{ showRegister ? 'Back to Login' : 'Create an account' }}
            </UButton>
          </div>
        </form>

        <!-- Register Form -->
        <form v-if="showRegister" class="space-y-6 mt-6 pt-6 border-t" @submit.prevent="handleRegister">
          <h3 class="text-lg font-semibold">Register</h3>

          <UFormGroup label="Name" name="name" required>
            <UInput v-model="registerForm.name" type="text" placeholder="Your Name" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" required>
            <UInput v-model="registerForm.email" type="email" placeholder="email@example.com" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput v-model="registerForm.password" type="password" placeholder="********" :disabled="loading" />
          </UFormGroup>

          <div>
            <UButton type="submit" block :loading="loading" color="green" size="lg"> Register </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const router = useRouter();

const loading = ref(false);
const showRegister = ref(false);

const form = ref({
  email: '',
  password: '',
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: form.value,
    });

    if (error.value) {
      throw new Error(error.value.data?.message || 'Login gagal');
    }

    toast.add({
      title: 'Login Berhasil',
      description: 'Selamat datang!',
      color: 'green',
    });

    router.push('/dashboard');
  } catch (err: any) {
    toast.add({
      title: 'Login Gagal',
      description: err.message,
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: registerForm.value,
    });

    if (error.value) {
      throw new Error(error.value.data?.message || 'Registrasi gagal');
    }

    toast.add({
      title: 'Registrasi Berhasil',
      description: 'Silakan login dengan akun Anda',
      color: 'green',
    });

    showRegister.value = false;
    form.value.email = registerForm.value.email;
  } catch (err: any) {
    toast.add({
      title: 'Registrasi Gagal',
      description: err.message,
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};
</script>
