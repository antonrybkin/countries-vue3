export function getTransformedFlagUrl(url, width = 100, height = 60) {
  const urlParts = url.split('/');
  urlParts[3] = `${width}x${height}`; // Обновляем размеры
  return urlParts.join('/');
}
