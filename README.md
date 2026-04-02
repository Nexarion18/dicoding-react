# Forum Diskusi - Submission 1

## Tujuan Submission
Proyek ini memenuhi:
- Automation testing: Unit, Integration, dan End-to-End.
- Deployment dengan CI/CD.
- Pemanfaatan React ecosystem di luar daftar yang dikecualikan.

## React Ecosystem yang Digunakan
Aplikasi memakai **react-hook-form** pada halaman login untuk manajemen form dan validasi.

## Menjalankan Proyek
```bash
npm install
npm run dev
```

## Menjalankan Pengujian
```bash
npm test
npm run e2e
```

## Konfigurasi CI
CI memakai GitHub Actions melalui workflow di `.github/workflows/ci.yml`.

Pipeline menjalankan:
1. `npm ci`
2. `npm test`
3. `npm run build`
4. `npm run e2e`

## Konfigurasi CD (Vercel)
1. Hubungkan repository GitHub ke Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Aktifkan auto-deploy untuk branch produksi (`master` atau `main`).

## Branch Protection (master)
Atur branch protection rule pada branch `master`:
1. Buka Settings > Branches > Add rule.
2. Branch name pattern: `master`.
3. Aktifkan **Require a pull request before merging**.
4. Aktifkan **Require status checks to pass before merging**.
5. Pilih check dari workflow CI.

## Bukti yang Harus Dilampirkan di ZIP
Buat folder `screenshots/` lalu lampirkan:
- `1_ci_check_error` (CI gagal saat test gagal)
- `2_ci_check_pass` (CI sukses saat test lulus)
- `3_branch_protection` (branch protection aktif pada PR)

## URL Vercel
Isi URL deployment Anda di sini setelah deploy:
- Vercel URL: `https://<project-name>.vercel.app`
