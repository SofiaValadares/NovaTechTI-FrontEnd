/**
 * API em produção (Render).
 * Para desenvolvimento local com backend na máquina, crie .env com:
 * REACT_APP_API_URL=http://localhost:8080
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://novateckti-backend.onrender.com';
