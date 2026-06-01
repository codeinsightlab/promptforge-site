### 2026-06-01 09:53 - 首页最终文案收口

- 原始目标：首页最后一轮文案调整，完成后暂停首页优化。
- 本轮轮次：内容收敛后的第 4 轮首页文案调整。
- 上一轮做法：首页已改为 `Prompts worth keeping`，强调 Prompt 经历使用后被保留。
- 用户反馈 / 否定点：首页还没有足够明确说明这些 Prompt 在现实里解决什么问题。
- 本轮调整方向：Hero 副标题补充技术判断、项目启动、想法整理、外包沟通四类问题；Intro 补充公开 4 个 Prompt、其余 review 的轻量说明；Featured 文案转为“我仍然会使用的 Prompt”。
- 涉及文件：`data/homepage.json`、生成后的 `index.html`、`en/index.html`、`dist/index.html`、`dist/en/index.html`。
- 沿用内容：Hero 标题、现有布局、导航、首页入口、4 个 KEEP Prompt、sitemap 不变。
- 回滚 / 放弃内容：不继续打磨 Hero，不新增模块，不把数量少作为主卖点。
- 当前状态：已完成生成、构建和截图检查；首页最终文案已收口。
- 后续注意：暂停首页优化，后续重心转向 Prompt 内容、使用证据、用户反馈和 Google 收录观察。

### 2026-06-01 09:43 - KEEP 详情页作者笔记落地

- 原始目标：将 4 个 KEEP Prompt 详情页从 Prompt 展示页升级为 Prompt + Context。
- 本轮轮次：内容收敛后的第 3 轮详情页增强。
- 上一轮做法：已完成首页叙事和详情页增强方案审查，确认新增 Why / What / How / Stayed / Changed / Boundary 笔记。
- 用户反馈 / 否定点：不再讨论文案方向，要求直接落地，仅增强 4 个 KEEP 详情页。
- 本轮调整方向：在 4 个 KEEP JSON 的中英文 `notes` 中补齐 6 个字段；生成器在 Prompt 正文前渲染作者笔记；校验器只强制 KEEP 内容具备 notes。
- 涉及文件：`data/prompts/tech-lead-agent.json`、`data/prompts/ai-coding-project-kickoff-workflow.json`、`data/prompts/idea-sparring-partner.json`、`data/prompts/freelance-client-communication.json`、`scripts/generate-prompts.js`、`scripts/validate-prompts.js`、`AGENTS.md`、4 个 KEEP 中英文详情页、`dist/`。
- 沿用内容：Prompt 正文保持原样；首页内容和 REVIEW 内容不调整。
- 回滚 / 放弃内容：不新增页面、不新增 Case Study、不把 notes 扩写成案例文章。
- 当前状态：已完成生成和校验；4 个 KEEP 详情页已在 Prompt 正文前渲染 6 段作者笔记。
- 后续注意：后续 KEEP 内容必须先有真实使用背景再补 notes；不得为 REVIEW 内容编造 field-tested 说明。

### 2026-06-01 09:13 - 首页文案叙事收敛

- 原始目标：在 4 个 KEEP Prompt 基础上优化首页文案，让用户理解这些 Prompt 是长期使用后留下来的。
- 本轮轮次：内容收敛后的第 2 轮首页文案调整。
- 上一轮做法：首页强调“小而可信”“只发布经过真实场景测试”“质量优先于数量”。
- 用户反馈 / 否定点：首页叙事仍停留在“为什么只有 4 个”，没有充分回答“为什么这 4 个值得留下来”。
- 本轮调整方向：去掉防御式目录站表述和数量叙事，改为“经历使用、改写、淘汰后仍被保留”。
- 涉及文件：`data/homepage.json`、生成后的 `index.html`、`en/index.html`、`dist/index.html`、`dist/en/index.html`。
- 沿用内容：沿用 4 个 KEEP Prompt 和现有布局结构、卡片、栏目。
- 回滚 / 放弃内容：放弃 `collection`、`Quality over quantity`、`只有 4 个 / 内容少` 作为首页主表达。
- 当前状态：已完成生成和校验；首页文案已转向“经历使用后仍被保留”，未新增布局或功能。
- 后续注意：后续首页文案优先讲保留逻辑和长期使用，不把数量少当卖点。

### 2026-06-01 08:33 - PromptForge V2 内容收敛

- 原始目标：收缩 PromptForge 内容范围，只公开作者真实长期使用、经过验证、持续复用的 Prompt。
- 本轮轮次：第 1 轮执行。
- 上一轮做法：上一轮为只读内容资产审查，未修改文件。
- 用户反馈 / 否定点：要求不新增 Prompt、不新增 Case Study、不改视觉设计、不改首页结构，只做内容收敛。
- 本轮调整方向：新增 `status = keep / review` 内容状态；首页、sitemap、发布目录只保留 KEEP；REVIEW 源文件保留但归档隐藏。
- 涉及文件：`data/prompts/*.json`、`data/homepage.json`、`scripts/generate-prompts.js`、`scripts/generate-index.js`、`scripts/validate-prompts.js`、`scripts/build-dist.js`、`AGENTS.md`、`sitemap.xml`、生成后的中英文首页与 dist。
- 沿用内容：KEEP 内容沿用 Tech Lead Agent、AI Coding Project Kickoff、想法陪练官、外包沟通顾问；REVIEW 内容不删除。
- 回滚 / 放弃内容：放弃将 API/性能/SQL/Redis/分布式/监控/Codex GPT Workflow 继续作为公开入口展示。
- 当前状态：已完成生成和校验；首页、sitemap 和 dist 发布目录只保留 4 个 KEEP 内容。
- 后续注意：后续新增或恢复内容前，必须先确认是否经过真实长期使用；REVIEW 内容恢复公开时必须改为 `status = keep` 并重新生成。
