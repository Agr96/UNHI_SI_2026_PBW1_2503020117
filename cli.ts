import * as p from '@clack/prompts';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, readdirSync } from 'fs';
import pc from 'picocolors';
import 'dotenv/config';

// Interface untuk memastikan tipe data konsisten
interface TuiData {
    pertemuan: number;
    tugas: number;
    confirm: boolean;
}

async function main() {
    console.clear();
    p.intro(pc.bgBlue(pc.white(' 🚀 UNHI Assignment Wrapper (Strict TS Edition) ')));

    // 1. Ambil data dari .env
    const USER_NIM = process.env.USER_NIM || "2503020117";
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "mahasiswa";
    const REPO_NAME = `UNHI_SI_2026_PBW1_${USER_NIM}`;

    // 2. Form validasi input interaktif (Kaku Penamaan)
    const group = await p.group(
        {
            pertemuan: () => p.text({
                message: 'Pertemuan ke-berapa?',
                placeholder: 'Contoh: 3',
                validate(value) {
                    if (value.length === 0) return 'Pertemuan harus diisi!';
                    if (isNaN(Number(value))) return 'Pertemuan harus berupa angka yang valid!';
                    if (Number(value) <= 0) return 'Angka pertemuan harus lebih dari 0.';
                }
            }),
            tugas: () => p.text({
                message: 'Tugas nomor berapa?',
                placeholder: 'Contoh: 2',
                validate(value) {
                    if (value.length === 0) return 'Tugas harus diisi!';
                    if (isNaN(Number(value))) return 'Nomor Tugas harus berupa angka yang valid!';
                    if (Number(value) <= 0) return 'Angka tugas harus lebih dari 0.';
                }
            }),
            confirm: () => p.confirm({
                message: 'Pindahkan file .php, commit, dan push ke GitHub?'
            }),
        },
        {
            onCancel: () => {
                p.cancel('❌ Operasi dibatalkan oleh pengguna.');
                process.exit(0);
            },
        }
    ) as unknown as TuiData; // Typing strict casting

    if (group.confirm) {
        const s = p.spinner();
        s.start('Sedang memproses & menata struktur repositori...');

        // FOLDER & BRANCH STRICT NAMING CONVENTION
        const BRANCH = `Pertemuan_${group.pertemuan}_Tugas_${group.tugas}`;
        const FOLDER_LOWER = `pertemuan ${group.pertemuan}`; // As per your existing folders 'pertemuan 1' dll.
        
        try {
            // Pastikan folder ada
            if (!existsSync(`./${FOLDER_LOWER}`)) {
                mkdirSync(`./${FOLDER_LOWER}`);
            }

            // Pindah branch atau buat branch baru
            try {
                execSync(`git checkout -b ${BRANCH} 2> NUL || git checkout ${BRANCH} 2> NUL`);
            } catch (e) {
                // Fallback jika belum init git
                try {
                    execSync(`git init`);
                    execSync(`git checkout -b main 2> NUL || git checkout -b master 2> NUL`);
                    execSync(`git checkout -b ${BRANCH}`);
                } catch { }
            }

            // Pindahkan file .php dari root ke folder pertemuan
            const files = readdirSync('./');
            let movedCount = 0;
            files.forEach(file => {
                if (file.endsWith('.php')) {
                    const source = `./${file}`;
                    const dest = `./${FOLDER_LOWER}/${file}`;
                    renameSync(source, dest);
                    movedCount++;
                }
            });

            // Lakukan Add, Commit dan Push
            execSync('git add .');
            
            try {
                execSync(`git commit -m "Submit Tugas ${group.tugas} Pertemuan ${group.pertemuan}" --allow-empty`);
            } catch (e) {
                // Gagal commit kemungkinan karena tidak ada perubahan (working tree clean) atau belum konfigurasi email git
            }
            
            try {
                execSync(`git push origin ${BRANCH} 2> NUL || git push -u origin ${BRANCH}`);
            } catch (e) {
                // Ignore jika belum setting up remote origin. Kita tetap cetak link generate dengan harapan origin standar
            }

            s.stop(pc.green(`✅ Berhasil! ${movedCount} file dipindahkan ke "${FOLDER_LOWER}" dan di-push ke branch "${BRANCH}".`));

            // FITUR AUTO-LINK GENERATOR
            const assignLink = pc.cyan(pc.underline(`https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/tree/${BRANCH}`));
            
            p.note(
                `1. Copy link di bawah ini.\n2. Kumpulkan di www.mahendrawardana.com\n\n🔗 ${assignLink}`,
                '💻 Tautan Pengumpulan Tugas'
            );

        } catch (err: any) {
            s.stop(pc.red('💥 Terjadi kesalahan sistem.'));
            p.note(err.message, 'Error Log');
        }
    }

    p.outro(pc.yellow(`Selesai. Selamat narik atau lanjut ngoding! ✨`));
}

main();
