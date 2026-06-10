### 2026-06-10 11:40 - 重构 Code-Fact-to-Skill 关系为“Skill 沉淀方法论”与“代码事实输入提取”
- 原始目标：清晰区分两个条目的职责边界，避免方法论页既承接 Skill 沉淀又承接代码扫描。
- 本轮轮次：基于最近反馈，重新定义能力结构。
- 上一轮做法：保留了 split，但方法论与执行页仍有方向交叉。
- 用户反馈 / 否定点：方法论未明确“可被 GPT 材料输入和 Codex 两种模式复用”，以及代码审查页被理解为直接生成 Skill。
- 本轮调整方向：
  - 将 `code-fact-to-skill-methodology` 定位为“Skill 沉淀方法论”。
  - 将 `business-fact-review-codex-prompt` 定位为“代码审查业务事实 Prompt”。
  - 明确关系：代码审查产物 -> 方法论沉淀。
  - 将职责性说明放在 JSON 字段与 `relatedPrompts`，不放入可复制正文。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`；`data/prompts/business-fact-review-codex-prompt.json`；`data/homepage.json`；`log/codex-task-log.md`。
- 沿用内容：`slug`、`status`、JSON/i18n 驱动、现有生成器链路。
- 回滚 / 放弃内容：未回滚旧页，仅重写 `zh/en` 的定位、使用方式与产出边界说明。
- 当前状态：职责关系收口完成；方法论支持 GPT/ChatGPT 材料模式与 Codex 路径/产物模式，代码审查页明确为 Skill 沉淀输入准备。
- 后续注意：继续保持两页的 `relatedPrompts` 内容仅做说明跳转，不在可复制 prompt 中出现路径。

### 2026-06-10 11:20 - 明确 Code-Fact-to-Skill 双场景定位
- 原始目标：区分 `code-fact-to-skill-methodology` 与 `business-fact-review-codex-prompt` 的使用对象，避免混淆 GPT 审查与 Codex 扫描。
- 本轮轮次：同一任务继续收敛，聚焦定位与说明。
- 上一轮做法：已完成方法论与执行条目分离，并用相关链接替换正文中的配套说明。
- 用户反馈 / 否定点：该条目定位仍可能被误读为纯方法论或纯 Codex 执行。
- 本轮调整方向：将方法论页定为审查/判断型 Prompt（GPT / Tech Lead），将 Codex 页定为执行型 Prompt，并在页面说明中明确两种使用方式。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`；`data/prompts/business-fact-review-codex-prompt.json`；`log/codex-task-log.md`。
- 沿用内容：`slug` 不变，`status=keep` 不变，JSON / i18n 驱动与生成器链路不变。
- 回滚 / 放弃内容：未回滚历史内容；未改 Object-Fact Parse；仅重写 `zh/en` 的定位与使用说明文案。
- 当前状态：方法论页强化了 GPT / ChatGPT 审查模式与 Codex 模式区分，Codex 页明确为本地代码扫描执行 Prompt，且链接不在可复制正文。
- 后续注意：待再次确认是否需要补齐 `cardTitle/cardDescription` 的中英语义对齐（当前已保持并已更新为区别场景）。

### 2026-06-10 10:26 - 方法论页与 Codex 执行 Prompt 关联改为相关资源链接
- 原始目标：将配套执行 Prompt 说明从方法论页 Prompt 正文移除，并通过页面可点击相关资源展示。
- 本轮轮次：进一步清理方法论与执行 Prompt 的内容职责边界。
- 上一轮做法：已完成方法论与执行 Prompt 的条目拆分，正文仍保留了“配套执行 Prompt”描述。
- 用户反馈 / 否定点：要求不再在方法论正文里出现可复制说明和裸路径。
- 本轮调整方向：新增 relatedPrompts 字段（最小 schema 扩展），在生成器添加相关资源区渲染，支持语言文本+链接展示。
- 涉及文件：data/prompts/code-fact-to-skill-methodology.json；data/prompts/business-fact-review-codex-prompt.json；scripts/generate-prompts.js。
- 沿用内容：slug、status、homepage栏目、JSON/i18n/生成器驱动、手写 HTML 输出链路不变。
- 当前状态：方法论正文不再包含配套执行说明；相关提示链接已放入相关资源区，中文/英文路径均可点击。

### 2026-06-10 10:10 - 拆分 Code-Fact-to-Skill Methodology 与 Codex 执行 Prompt
- 原始目标：把 code-fact-to-skill-methodology 从“方法论 + 可执行 Prompt 混合”拆分为方法论条目与配套 Codex 执行条目。
- 本轮轮次：新增内容结构拆分与栏目挂载同步。
- 上一轮做法：中文可读性与边界符清理已完成。
- 用户反馈 / 否定点：当前页面仍像“一个页面套两套 Prompt”。
- 本轮调整方向：保持原 slug 的方法论说明条目不再包含完整执行 Prompt，新增 business-fact-review-codex-prompt 用于可复制执行。
- 涉及文件：data/prompts/code-fact-to-skill-methodology.json；data/prompts/business-fact-review-codex-prompt.json；data/homepage.json；log/codex-task-log.md。
- 沿用内容：slug 保持 code-fact-to-skill-methodology 不变、status keep、JSON/i18n/生成器驱动、homepage agent-ai-engineering-methods 栏目。
- 回滚 / 放弃内容：未回滚旧内容；移除方法页中的完整 Codex 可复制任务正文，改由新条目承载。
- 当前状态：方法论拆分完成；待执行 validate / generate / build 并复核结果。
- 后续注意：若新增更多关联条目，优先通过正文字段做关系说明（当前 schema 无 related/linked 字段）。

### 2026-06-10 10:00 - Code-Fact-to-Skill Methodology 可复制 Prompt 边界符移除
- 原始目标：移除 code-fact-to-skill-methodology 正式内容中的 PROMPT BEGIN / PROMPT END，并保持 JSON/i18n 与生成器链路不变。
- 本轮轮次：2
- 上一轮做法：已完成中文内容中文化迭代，未触及复制边界符。
- 用户反馈 / 否定点：发现中文与英文可复用 Prompt 正文中仍遗留 PROMPT BEGIN / PROMPT END。
- 本轮调整方向：仅移除 JSON 与生成 HTML 中可复制正文里的边界符，不改方法论核心语义。
- 涉及文件：data/prompts/code-fact-to-skill-methodology.json；由生成链路覆盖的详情 HTML。
- 沿用内容：slug、status、字段结构、首页栏目配置、生成方式。
- 回滚 / 放弃内容：未回滚内容，仅回退边界符文本。
- 当前状态：PROMPT BEGIN / PROMPT END 已从源码与生成内容中移除，继续等待验证。
- 后续注意：按要求执行 validate / generate / build 并核验首页栏目与复制内容。

### 2026-06-10 09:55 - 迭代 Code-Fact-to-Skill 中文可读性

- 原始目标：减少中文页非必要英文方法论术语，让中文内容更易读、贴近中文表述。
- 本轮轮次：同一任务中文本地化迭代中的第 5 轮细化。
- 上一轮做法：已完成生成体系回归与首页栏目挂载，中文术语未完全中文化。
- 用户反馈 / 否定点：中文页面仍有过多英文方法论标签（例如 Fact Catalog、Gold Set、Failure Attribution 等）影响可读性。
- 本轮调整方向：保留核心方法语义和固定技术词，系统性中文化 `zh` 字段里的方法步骤、失败归因、输出要求与示例输入/输出/使用说明。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`、`log/codex-task-log.md`。
- 沿用内容：`slug=code-fact-to-skill-methodology`、`status=keep`、`type=standard-prompt`、首页 `agent-ai-engineering-methods` 栏目挂载关系。
- 回滚 / 放弃内容：未回滚；未改变英文页面结构；未修改 Object-Fact Parse 实验代码。
- 当前状态：中文可复用 Prompt 输出项已中文化，英文端保留；待执行 validate / generate / build 收口。
- 后续注意：如需统一全局术语，可同步评估其他页面的中文提示文本，但本轮不扩展到其他条目。

### 2026-06-10 09:49 - 修正 Code-Fact-to-Skill 数据驱动与栏目挂载

- 原始目标：确认 `code-fact-to-skill-methodology` 以 JSON/i18n 为源并保持可发布入口完整，新增 `Agent & AI Engineering Methods` 首页栏目挂载该 slug。
- 本轮轮次：同一任务连续修改中的第 4 轮聚合修正。
- 上一轮做法：已完成通用化内容修订与 KEEP 纳入，条目仍在 `ai-collaboration` 栏目。
- 用户反馈 / 否定点：明确要求恢复数据源驱动并按栏目分类承接 AI 工程方法类，不再沿用协作栏目承载语义混合。
- 本轮调整方向：补齐方法标题与核心描述字段、统一 Reusable Prompt 中英文占位约束、保留 `code-fact-to-skill-methodology` slug，不新增独立静态内容，新增专属首页栏目并将条目移动至该栏目。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`、`data/homepage.json`、`log/codex-task-log.md`。
- 沿用内容：`status=keep`、`type=standard-prompt`、slug、KEEP 入口规则与验证框架。
- 回滚 / 放弃内容：未回滚；不保留 `code-fact-to-skill-methodology` 在 AI 协作栏目中的展示位，仅保留其新栏目入口。
- 当前状态：已完成源内容与首页栏目结构修改，待执行 `validate -> generate -> build` 验证。
- 后续注意：检查生成后的 `index.html` 与 `dist/` 首页卡片显示是否与新栏目标题和标签一致。

### 2026-06-10 09:47 - 去业务化修正 Code-Fact-to-Skill Methodology

- 原始目标：把 `code-fact-to-skill-methodology` 条目从订单业务路径里抽离，改成通用“代码事实到 Skill”的方法论文案。
- 本轮轮次：本轮连续修改中的第 3 轮细化修正。
- 上一轮做法：完成条目入库为 KEEP，并已完成首页/登记表收口与基础校验。
- 用户反馈 / 否定点：页面主体、Reusable Prompt、输入示例仍有订单/支付/发货类业务语境，且可复用性边界不够清晰。
- 本轮调整方向：完全通用化主体验证语言，新增必需占位符变量，替换 `exampleInput` 为通用占位式输入，保留来源案例为“来源说明”而非方法前置条件。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`、`log/codex-task-log.md`。
- 沿用内容：KEEP 状态、slug、卡片入口与现有 AGENTS 登记行不变。
- 回滚 / 放弃内容：移除订单、支付、发货等领域词在主体验证体的出现；移除模型版本标签（如 8B/4B）在 Core Method、Output Sequence、可复用提示中的出现。
- 当前状态：已完成通用化修订；`npm run validate` 通过，KEEP 数与收敛口径未变化。
- 后续注意：如后续新增案例细节，不在方法主体中加入具体业务词，仅保留在“来源说明”并明确“非前置条件”。

### 2026-06-10 09:34 - 将 Code-Fact-to-Skill Methodology 纳入正式 KEEP 内容

- 原始目标：将 Code-Fact-to-Skill Methodology 从实验资产同步到 PromptForge 正式内容库（KEEP），并完成页面登记与首页入口可见性收口。
- 本轮轮次：第 2 轮同步动作，覆盖新增内容与主页治理两类变更。
- 上一轮做法：已新增 `data/prompts/code-fact-to-skill-methodology.json` 并补齐 `status=keep` 与 notes。
- 用户反馈 / 否定点：要求把该方法从实验状态纳入正式库并对齐 KEEP 治理、首页与登记表口径。
- 本轮调整方向：将 KEEP 数量与登记表口径改为 5 个；把新页面加入 `code-fact-to-skill-methodology` 的 ai-collaboration 入口；更新首页公开文案；补齐日志现场。
- 涉及文件：`data/prompts/code-fact-to-skill-methodology.json`、`AGENTS.md`、`data/homepage.json`、`log/codex-task-log.md`、（后续）`dist/`。
- 沿用内容：保留新建方法页的核心角色结构、6 段 notes 与卡片字段。
- 回滚 / 放弃内容：未保留可视化占位符变量块，已改为自然语言上下文确认流程；未回退 `status=review`。
- 当前状态：任务同步内容已落地，待执行校验与生成构建命令确认收口结果。
- 后续注意：若后续调整卡片文案或评分字段，继续通过 `validate` 与 `generate` 回归并保持 5 个 KEEP 口径不变。

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
