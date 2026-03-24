import 'dotenv/config';

// Mengambil variabel dari .env dengan fallback yang aman
const USER_NIM = process.env.USER_NIM || "2503020117";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "mahasiswa";
const GITHUB_EMAIL = process.env.GITHUB_EMAIL || `${GITHUB_USERNAME}@users.noreply.github.com`;

// Ekspor konfigurasi sebagai konstanta statis
export const AppConfig = {
    USER_NIM,
    GITHUB_USERNAME,
    GITHUB_EMAIL,
    REPO_NAME: `UNHI_SI_2026_PBW1_${USER_NIM}`,
    // Base URL untuk auto-link generator
    GITHUB_BASE_URL: `https://github.com/${GITHUB_USERNAME}/UNHI_SI_2026_PBW1_${USER_NIM}`
} as const;
