**OxyCCG 使用指南**

------

## 安装方式

### 完整安装（推荐首次使用）

```bash
npx @chinhae/oxyccg install
```

自动安装：

- npm 包：OpenSpec、CCG Workflow
- 寸止：AI 对话防早停工具
- Superpowers：Claude Code 技能插件
- GuDaStudio Skills：Codex/Gemini 协作技能
- 你的自定义工作流：oxyccg、oxyccg-plan、oxyccg-dev、oxyccg-ship

### 选择性安装

```bash
# 只安装配置文件
npx @chinhae/oxyccg install --only config

# 只安装寸止
npx @chinhae/oxyccg install --only cunzhi

# 只安装 npm 包
npx @chinhae/oxyccg install --only npm

# 只安装 Superpowers
npx @chinhae/oxyccg install --only superpowers

# 只安装 GuDaStudio Skills
npx @chinhae/oxyccg install --only skills
```

### 跳过某些组件

```bash
# 跳过 Superpowers 和 Skills
npx @chinhae/oxyccg install --skip superpowers,skills

# 只跳过寸止
npx @chinhae/oxyccg install --skip cunzhi
```

------

## 更新方式

```bash
npx @chinhae/oxyccg update
```

从 GitHub 拉取 `oxyccg-config` 仓库的最新配置，覆盖 `~/.claude/commands/ccg/myccg*.md`

------

## 卸载方式

```bash
npx @chinhae/oxyccg uninstall
```

删除 `~/.claude/commands/ccg/` 下的 4 个 myccg 文件。

**注意**：npm 包和插件需手动卸载：

```bash
npm uninstall -g @fission-ai/openspec ccg-workflow
brew uninstall cunzhi  # macOS
```

**寸止卸载方式汇总**：

| 平台         | 卸载命令                                   |
| ------------ | ------------------------------------------ |
| macOS (brew) | `brew uninstall cunzhi`                    |
| macOS (手动) | `rm ~/.local/bin/cunzhi*`                  |
| Linux        | `rm ~/.local/bin/cunzhi*`                  |
| Windows      | 删除 `%USERPROFILE%\.local\bin\cunzhi.exe` |