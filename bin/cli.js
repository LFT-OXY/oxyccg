#!/usr/bin/env node

const { program } = require('commander');
const installer = require('../lib/installer');

program
  .name('oxyccg')
  .description('OxyCCG - 多模型协作开发工作流安装工具')
  .version('1.0.0');

program
  .command('install')
  .description('安装所有组件')
  .option('--only <component>', '只安装指定组件: npm|cunzhi|superpowers|skills|config')
  .option('--skip <components>', '跳过指定组件(逗号分隔)')
  .action((options) => installer.install(options));

program
  .command('update')
  .description('更新配置文件到最新版本')
  .action(() => installer.update());

program
  .command('uninstall')
  .description('卸载自定义配置')
  .action(() => installer.uninstall());

program.parse();
