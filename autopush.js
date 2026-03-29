const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd, options = { stdio: 'inherit' }) => {
    try {
        console.log(`\nExecuting: ${cmd}`);
        return execSync(cmd, options);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
};

const reorganize = () => {
    const folders = fs.readdirSync('.').filter(file => 
        fs.statSync(file).isDirectory() && /^pertemuan \d+$/i.test(file)
    );

    if (folders.length === 0) {
        console.log('No "pertemuan X" folders found.');
        return;
    }

    // 1. CLEAN MAIN BRANCH (Remote)
    console.log('\n--- Cleaning main branch... ---');
    run('git checkout main');
    folders.forEach(folder => {
        try { run(`git rm -r "${folder}"`, { stdio: 'pipe' }); } catch (e) {}
    });

    if (run('git status --porcelain', { stdio: 'pipe' }).toString()) {
        run('git commit -m "Cleanup main: remove pertemuan folders"', { stdio: 'pipe' });
        run('git push origin main --force');
    }

    // 2. PROCESS EACH BRANCH
    folders.forEach(folder => {
        const branchNum = folder.match(/\d+/)[0];
        const branchName = `Pertemuan_${branchNum}`;
        console.log(`\n--- Reorganizing "${folder}" -> branch "${branchName}" ---`);

        run(`git checkout -B ${branchName} main`);
        run(`git checkout main -- "${folder}"`, { stdio: 'pipe' });
        
        if (fs.existsSync(folder)) {
            const files = fs.readdirSync(folder);
            files.forEach(file => {
                const src = path.join(folder, file);
                const dest = path.join('.', file);
                fs.copyFileSync(src, dest);
            });
            run(`git rm -rf "${folder}"`, { stdio: 'pipe' });
        }

        run('git add .');
        if (run('git status --porcelain', { stdio: 'pipe' }).toString()) {
            run(`git commit -m "Reorganize: Move ${folder} content to root"`);
            run(`git push origin ${branchName} --force`);
        }
    });

    // 3. RESTORE LOCAL STATE
    console.log('\n--- Restoring local repository state... ---');
    run('git checkout main');
    folders.forEach(folder => {
        const branchNum = folder.match(/\d+/)[0];
        const branchName = `Pertemuan_${branchNum}`;
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        try {
            run(`git checkout ${branchName} -- .`, { stdio: 'pipe' });
            const files = fs.readdirSync('.').filter(f => 
                !['autopush.js', 'package.json', 'node_modules', '.git', '.env', 'package-lock.json', 'cli.ts', 'config.ts', 'tsconfig.json', 'pertemuan.txt'].includes(f) &&
                !folders.includes(f)
            );
            files.forEach(f => {
                if (fs.existsSync(f)) {
                    fs.renameSync(f, path.join(folder, f));
                }
            });
        } catch (e) {}
    });
};

reorganize();
