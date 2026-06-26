export function decodeToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
}

export function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;

  const agoraEmSegundos = Date.now() / 1000;
  return payload.exp > agoraEmSegundos;
}

export function getTimeUntilExpiration() {
  const token = localStorage.getItem("token");
  if (!token) return 0;

  const payload = decodeToken(token);
  if (!payload || !payload.exp) return 0;

  const msRestantes = payload.exp * 1000 - Date.now();
  return msRestantes > 0 ? msRestantes : 0;
}

export function limparSessao() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioId");
}
