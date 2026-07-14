export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const data = await $fetch(`${config.flaskApiUrl}/health`, {
      method: 'GET',
      timeout: 15000,
    });
    return { online: true, ...data as object };
  } catch {
    return {
      online: false,
      message: `Flask API tidak dapat dihubungi di ${config.flaskApiUrl}`,
    };
  }
});
