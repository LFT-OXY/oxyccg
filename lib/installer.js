const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const ora = require('ora');

const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const CONFIG_REPO = 'https://github.com/LFT-OXY/oxyccg-config.git';

const NPM_PACKAGES = [
  '@fission-ai/openspec@latest',
  'ccg-workflow'
];

async function install(options = {}) {
  const only = options.only;
  const skip = options.skip ? options.skip.split(',') : [];

  console.log(chalk.cyan('\n🚀 OxyCCG 安装开始\n'));

  const steps = [
    { name: 'npm', fn: installNpmPackages, label: 'npm 包 (OpenSpec, CCG)' },
    { name: 'cunzhi', fn: installCunzhi, label: '寸止' },
    { name: 'superpowers', fn: installSuperpowers, label: 'Superpowers 插件' },
    { name: 'skills', fn: installSkills, label: 'GuDaStudio Skills' },
    { name: 'config', fn: installConfig, label: '自定义工作流配置' }
  ];

  for (const step of steps) {
    if (only && step.name !== only) continue;
    if (skip.includes(step.name)) {
      console.log(chalk.yellow(`⏭️  跳过 ${step.label}`));
      continue;
    }

    const spinner = ora(`安装 ${step.label}...`).start();
    try {
      await step.fn();
      spinner.succeed(`${step.label} ✓`);
    } catch (err) {
      spinner.fail(`${step.label} 失败: ${err.message}`);
      if (step.name === 'npm') throw err;
    }
  }

  console.log(chalk.green('\n✅ 安装完成！'));
  console.log(chalk.dim('使用 /ccg:oxyccg <任务> 开始开发\n'));
}

function installNpmPackages() {
  execSync(`npm install -g ${NPM_PACKAGES.join(' ')}`, { stdio: 'pipe' });
}

function installCunzhi() {
  const platform = os.platform();
  
  if (platform === 'darwin') {
    try {
      execSync('brew tap imhuso/cunzhi && brew install cunzhi', { stdio: 'pipe' });
    } catch {
      const arch = os.arch() === 'arm64' ? 'aarch64' : 'x86_64';
      const url = `https://github.com/imhuso/cunzhi/releases/latest/download/cunzhi-cli-darwin-${arch}.tar.gz`;
      const binDir = path.join(HOME, '.local', 'bin');
      fs.mkdirSync(binDir, { recursive: true });
      execSync(`curl -fsSL "${url}" | tar -xz -C "${binDir}"`, { stdio: 'pipe' });
      console.log(chalk.dim(`\n  已安装到 ${binDir}，请确保该目录在 PATH 中`));
    }
  } else if (platform === 'linux') {
    const binDir = path.join(HOME, '.local', 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    execSync(`curl -fsSL "https://github.com/imhuso/cunzhi/releases/latest/download/cunzhi-cli-linux-x86_64.tar.gz" | tar -xz -C "${binDir}"`, { stdio: 'pipe' });
  } else {
    throw new Error(`不支持的平台: ${platform}，请手动安装寸止`);
  }
}

function installSuperpowers() {
  try {
    execSync('claude /plugin install superpowers@superpowers-marketplace', { stdio: 'pipe' });
  } catch {
    console.log(chalk.yellow('\n  ⚠️  自动安装失败，请手动运行:'));
    console.log(chalk.dim('  claude /plugin install superpowers@superpowers-marketplace'));
  }
}

function installSkills() {
  const tmpDir = path.join(os.tmpdir(), 'gudaskills-' + Date.now());
  try {
    execSync(`git clone --depth 1 https://github.com/GuDaStudio/skills.git "${tmpDir}"`, { stdio: 'pipe' });
    execSync(`cd "${tmpDir}" && chmod +x install.sh && ./install.sh --user --all`, { stdio: 'pipe' });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function installConfig() {
  const tmpDir = path.join(os.tmpdir(), 'oxyccg-config-' + Date.now());
  try {
    execSync(`git clone --depth 1 ${CONFIG_REPO} "${tmpDir}"`, { stdio: 'pipe' });
    
    const srcCommands = path.join(tmpDir, 'commands', 'ccg');
    const destCommands = path.join(CLAUDE_DIR, 'commands', 'ccg');
    
    if (fs.existsSync(srcCommands)) {
      fs.mkdirSync(destCommands, { recursive: true });
      const files = fs.readdirSync(srcCommands);
      for (const file of files) {
        fs.copyFileSync(
          path.join(srcCommands, file),
          path.join(destCommands, file)
        );
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function update() {
  console.log(chalk.cyan('\n🔄 更新配置...\n'));
  const spinner = ora('拉取最新配置...').start();
  try {
    installConfig();
    spinner.succeed('配置已更新');
    console.log(chalk.green('\n✅ 更新完成！\n'));
  } catch (err) {
    spinner.fail(`更新失败: ${err.message}`);
  }
}

function uninstall() {
  console.log(chalk.cyan('\n🗑️  卸载 OxyCCG 配置...\n'));
  
  const files = ['oxyccg.md', 'oxyccg-plan.md', 'oxyccg-dev.md', 'oxyccg-ship.md'];
  const dir = path.join(CLAUDE_DIR, 'commands', 'ccg');
  
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(chalk.dim(`  删除 ${file}`));
    }
  }
  
  console.log(chalk.green('\n✅ 卸载完成'));
  console.log(chalk.dim('npm 包和插件请手动卸载\n'));
}

module.exports = { install, update, uninstall };
