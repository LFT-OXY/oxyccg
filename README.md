**OxyCCG 使用指南**

------

Claude Code 编排 Codex + Gemini 的多模型协作开发系统。前端任务路由至 Gemini，后端任务路由至 Codex，Claude 负责编排决策和代码审核。

---

**要求**：Claude Code CLI、Node.js 18+

**可选**：Codex CLI（后端）、Gemini CLI（前端）



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



## 命令



| 命令                  | 说明               |
| --------------------- | ------------------ |
| `/ccg:oxyccg`         | 完整工作流         |
| `/ccg:oxyccg-plan`    | 需求分析，计划文档 |
| `/ccg:oxyccg-dev`     | 代码实施+审查      |
| `/ccg:oxyccg-ship`    | 交付               |
| `/ccg:workflow`       | 6 阶段完整工作流   |
| `/ccg:feat`           | 新功能开发         |
| `/ccg:frontend`       | 前端任务 (Gemini)  |
| `/ccg:backend`        | 后端任务 (Codex)   |
| `/ccg:analyze`        | 技术分析           |
| `/ccg:debug`          | 问题诊断           |
| `/ccg:optimize`       | 性能优化           |
| `/ccg:test`           | 测试生成           |
| `/ccg:review`         | 代码审查           |
| `/ccg:commit`         | Git 提交           |
| `/ccg:rollback`       | Git 回滚           |
| `/ccg:clean-branches` | 清理分支           |
| `/ccg:worktree`       | Worktree 管理      |
| `/ccg:init`           | 初始化 CLAUDE.md   |
| `/ccg:enhance`        | Prompt 增强        |



## 配置



### 目录结构



```
~/.claude/
├── commands/ccg/       # 斜杠命令
├── agents/ccg/         # 子智能体
├── bin/codeagent-wrapper
└── .ccg/
    ├── config.toml
    └── prompts/{codex,gemini}/
```



### 环境变量



| 变量                           | 说明                              | 默认值 |
| ------------------------------ | --------------------------------- | ------ |
| `CODEAGENT_POST_MESSAGE_DELAY` | Codex 完成后等待时间（秒）        | 5      |
| `CODEX_TIMEOUT`                | codeagent-wrapper 执行超时（秒）  | 7200   |
| `BASH_DEFAULT_TIMEOUT_MS`      | Claude Code Bash 默认超时（毫秒） | 120000 |
| `BASH_MAX_TIMEOUT_MS`          | Claude Code Bash 最大超时（毫秒） | 600000 |

配置方式（`~/.claude/settings.json`）：

```
{
  "env": {
    "CODEAGENT_POST_MESSAGE_DELAY": "1",
    "CODEX_TIMEOUT": "7200",
    "BASH_DEFAULT_TIMEOUT_MS": "600000",
    "BASH_MAX_TIMEOUT_MS": "3600000"
  }
}
```



### MCP 配置



ace-tool 用于代码检索和 Prompt 增强，安装时可选配置。

Token 获取：https://augmentcode.com/



## 已知问题



**Codex CLI 0.80.0 进程不退出**

`--json` 模式下 Codex 完成输出后进程不会自动退出。

解决：设置 `CODEAGENT_POST_MESSAGE_DELAY=1`





