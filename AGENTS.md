# PromptForge 项目约束

## 1. 项目定位

PromptForge 是一个面向开发者的 **AI 会话启动器**。

它不是：

- 普通 Prompt 列表站
- AI 提示词大全
- 教程文章站
- 一次性填空模板库
- 复杂表单生成器

核心目标是：

让开发者复制一段“角色 Prompt”，粘贴到 GPT / ChatGPT / Codex 等 AI 对话中，先建立专业角色、工作方式、分析约束和输出结构；然后用户在下一条消息输入真实工程材料，AI 再进行追问、分析、定位、评审或输出方案。

默认使用流程：

1. 用户复制页面中的“角色 Prompt”
2. 粘贴到 AI 对话中
3. AI 建立角色、工作方式和输出约束
4. 用户继续输入真实工程材料
5. AI 根据信息追问、分析和输出结果

---

## 2. 页面默认结构

后续所有 Prompt 页面优先采用以下结构：

1. 标题
2. 场景
3. 角色 Prompt
4. 你接下来可以这样输入
5. GPT 会这样输出
6. 使用说明

说明：

- “角色 Prompt”是唯一核心复制区。
- “你接下来可以这样输入”是用户下一条消息的参考，不属于角色 Prompt 本体。
- “GPT 会这样输出”是效果预览，不是完整长答案。
- “使用说明”必须体现“先复制角色 Prompt，再输入真实材料”的流程。

旧结构迁移规则：

- `Prompt` → `角色 Prompt`
- `示例输入` → `你接下来可以这样输入`
- `示例输出` → `GPT 会这样输出`

---

## 3. 角色 Prompt 约束

角色 Prompt 必须包含：

- 角色
- 工作方式
- 用户后续可能提供的信息类型
- 信息不足时如何追问
- 信息足够时如何输出
- 分析约束 / 执行约束
- 输出结构

角色 Prompt 不应该包含：

- 大量 `{{}}` 占位符
- 完整输入表单
- 示例输入
- 示例输出
- 让用户一次性填完的长模板
- 长篇教程或概念解释

角色 Prompt 的目标是 **开启一个专业会话**，不是让用户一次性填完所有信息。

推荐写法：

```text
# 角色

你是一名资深 Java 后端接口设计评审专家，擅长评估接口的幂等性、安全性、扩展性、数据一致性和上线风险。

# 工作方式

接下来我会继续提供接口定义、请求结构、响应结构、业务规则、权限规则和调用场景。

你需要先判断信息是否足够。

如果信息不足，最多追问 3 个最关键问题。

如果信息足够，请按约定结构输出评审结论。

# 输出结构

...
```

不推荐写法：

```text
接口路径：
{{接口路径}}

请求参数：
{{粘贴请求 JSON}}

业务规则：
{{业务规则}}
```

---

## 4. 用户输入参考约束

“你接下来可以这样输入”用于指导用户第二轮如何描述问题。

它可以包含字段示例，例如：

- 功能名称
- 预期行为
- 实际行为
- 复现步骤
- SQL / EXPLAIN / 表结构
- 日志 / 堆栈
- 接口定义 / 请求参数 / 响应结构
- 代码片段
- 业务规则
- 最近改动
- 怀疑点

要求：

- 不属于角色 Prompt 本体。
- 默认不放复制按钮。
- 不使用 `{{}}` 占位符。
- 不要完整重复角色 Prompt 中的全部字段。
- 尽量短，体现真实工程感。
- 作用是降低用户下一条消息的输入成本。
- 必须体现“可以参考，不必照抄”。

推荐在该区域补充提示：

```text
不用完全照抄，按你手头已有的信息发送即可；材料不全时，GPT 会继续追问。
```

---

## 5. 输出预览约束

“GPT 会这样输出”用于展示结果质量和输出形态。

要求：

- 是效果预览，不是完整长答案。
- 默认不放复制按钮。
- 不要比角色 Prompt 更长。
- 不要写成长报告。
- 重点展示结构和关键结果。

可以包含：

- 一句话结论
- 问题归属
- 关键证据
- 高风险点
- 最小修改方案
- 验证方式
- 回归测试清单

---

## 6. 复制能力约束

页面复制按钮优先作用于“角色 Prompt”。

默认规则：

- 角色 Prompt：保留复制按钮。
- 输入参考：默认不放复制按钮。
- 输出预览：默认不放复制按钮。

复制按钮文案优先使用：

```text
复制角色 Prompt
```

不要在页面中到处放复制按钮，避免用户不知道该复制什么。

如果后续要做“填写弹窗”“表单生成 Prompt”“PromptTemplateFiller”等能力，必须先重新确认产品方向；这些能力不作为当前默认方向。

---

## 7. 占位符约束

后续新增或改造页面时，应减少 `{{}}` 占位符使用。

允许在特殊页面保留少量占位符，但不应作为页面核心交互。

禁止继续设计大量一次性填空模板，例如：

```text
{{粘贴日志}}
{{输入业务规则}}
{{允许 / 不允许}}
{{例如：xxx}}
```

优先用自然语言说明用户后续会提供什么信息，例如：

```text
接下来我会提供 SQL、EXPLAIN、表结构、现有索引、数据量和查询场景。
```

而不是把这些字段全部塞进角色 Prompt 里。

---

## 8. 页面内容约束

每个 Prompt 页面必须围绕一个明确工程问题，不写泛泛教程。

禁止所有页面套同一套通用结构。

尤其禁止大量页面都使用类似结构：

- 问题描述
- 运行环境
- 关键日志
- 相关代码
- 最近变更

必须按领域设计角色 Prompt 的工作方式和输出结构。

示例：

### 慢 SQL 页面应体现

- SQL
- EXPLAIN
- 表结构
- 索引
- 数据量
- 查询条件
- 排序分页
- 最小优化方案
- 验证方式

### 灰度发布页面应体现

- 灰度对象
- 放量节奏
- feature flag
- 监控指标
- 回滚条件
- 数据兼容
- 旧链路保留

### 接口评审页面应体现

- 幂等性
- 权限
- 参数边界
- 状态流转
- 事务边界
- 外部系统
- 是否建议上线

---

## 9. 页面类型与迁移策略

后续页面可以按类型批量改造。

### 排查类

适合处理线上异常、Bug、日志、性能问题。

例如：

- Bug 定位
- 日志分析
- 接口超时问题排查
- 系统瓶颈定位
- 服务雪崩分析
- GC 问题分析
- 死锁问题排查
- MQ 消息丢失排查

### 评审类

适合评估设计是否可上线、是否有风险。

例如：

- 接口设计评审
- Redis 使用评审
- API 安全设计
- 权限模型设计

### 方案类

适合输出可执行技术方案。

例如：

- 灰度发布方案
- 分布式事务方案
- 数据一致性设计
- 缓存设计
- 监控报警设计
- 网关限流设计

### 优化类

适合已有实现或配置的优化。

例如：

- 慢 SQL 优化
- 索引失效分析
- 接口性能分析
- 线程池配置优化
- JVM 参数调优
- Redis 大 Key 分析

### 协作流

适合定义人、GPT、Codex 的协作方式。

例如：

- Codex + GPT 开发协作流

每一类页面可以先做一个样板页，再批量迁移同类页面。

---

## 10. 页面登记与去重机制

本文件必须维护“已有 Prompt 页面登记表”。

只要新增、重做、改名、删除 Prompt 页面，都必须同步更新登记表。

登记表目的：

1. 让后续对话快速知道项目里已经有哪些 Prompt 页面。
2. 避免重复生成相同或高度相似的 Prompt。
3. 方便批量迁移、审查和 SEO 规划。
4. 方便判断某个需求是“新增页面”还是“优化已有页面”。

---

## 11. 新增页面前必须检查

任何对话、任何 Codex 任务，在新增 Prompt 页面前，必须先读取本文件中的“已有 Prompt 页面登记表”。

如果用户要求新增页面，执行者必须先判断：

1. 是否已有完全相同主题页面。
2. 是否已有高度相似页面。
3. 是否应该新增页面，还是优化已有页面。
4. 是否会造成分类重复或关键词内耗。

如果发现重复，默认不要新增页面，应优先建议：

- 合并到已有页面
- 改造已有页面
- 调整新页面定位，让它和已有页面明确区分

新增页面标题不能只换说法但场景相同。

例如，以下主题高度相似，不能随意拆成多个页面：

- Bug 定位 Prompt
- 问题排查 Prompt
- 问题原因分析 Prompt
- 故障定位 Prompt

除非它们有明确边界：

- Bug 定位：针对具体功能异常
- 日志分析：针对已有异常日志和堆栈
- 系统瓶颈定位：针对性能和容量瓶颈
- 问题原因分析：可作为通用兜底页，但不能和 Bug 定位完全重复

新增页面必须说明它与已有相似页面的差异。

---

## 12. 新增或改造页面后必须更新登记表

如果确认新增页面，完成后必须同步更新登记表。

至少补充：

- 页面标题
- slug / 路由
- 类型
- 状态
- 核心场景
- 会话启动器改造状态
- 备注

如果只是重做已有页面，也必须更新状态和备注。

例如：

- 状态从“待重做”改为“已改造”
- 会话启动器改造从“否”改为“是”
- 备注中记录“已按角色 Prompt / 输入参考 / 输出预览结构改造”

Codex 新增或改造页面后，完成报告必须额外输出：

1. 是否已更新 Prompt 页面登记表
2. 登记表新增 / 修改了哪一行
3. 是否发现相似页面
4. 为什么本次是新增页面，而不是优化已有页面

---

## 13. 新增 Prompt 数据流程

后续新增普通 Prompt 页面，默认不直接修改 HTML 页面。

标准流程：

1. 新增 `data/prompts/{slug}.json`。
2. 确保 `type = "standard-prompt"`。
3. 执行 `npm run validate`。
4. 执行 `npm run generate`。
5. 执行 `npm run build`。
6. 本地检查 `dist/`。
7. 提交并推送。

说明：

- 普通 Prompt 页面使用 `standard-prompt`，由生成器生成详情页和 sitemap。
- 协作型页面使用 `workflow-prompt`。
- `workflow-prompt` 当前由生成器跳过，需要手工维护页面。

### JSON 内容模型补充：卡片内容字段

`data/prompts/*.json` 不只承载详情页内容，也需要承载首页、目录、推荐入口可复用的卡片内容。

从现在开始，新增 Prompt / Workflow JSON 时，必须在 `zh` 和 `en` 内分别包含：

- `cardTitle`
- `cardDescription`

字段含义：

- `title`：用于详情页主标题。
- `cardTitle`：用于首页卡片、目录卡片、推荐卡片等入口展示；必须比 `title` 更短，不强制带“Prompt”或“工作流”，优先表达用户要解决的问题。
- `description`：用于详情页摘要，可以稍微完整地说明页面价值。
- `scenario`：用于详情页场景说明，可以讲适用场景、输入材料和工作方式。
- `cardDescription`：只用于入口卡片，必须比 `description` 更短，一句话说明点击后能解决什么。

写作要求：

- `cardTitle` 要短、清楚、像入口标题、面向用户问题，不重复页面类型。
- `cardDescription` 要是一句话，比详情页 `description` 更轻，适合卡片空间。
- `cardDescription` 不写完整工作流步骤，不堆 GPT + Codex 术语。
- 中文 `cardDescription` 以不超过 40 个中文字为宜；英文控制在一句短句。
- 中英文 `cardTitle` / `cardDescription` 语义保持一致。

推荐示例：

```json
{
  "zh": {
    "title": "问题原因分析工作流",
    "cardTitle": "问题原因分析",
    "cardDescription": "问题类型还不明确时，先收敛现象、证据缺口和排查方向。"
  },
  "en": {
    "title": "Problem Cause Analysis Workflow",
    "cardTitle": "Problem Cause Analysis",
    "cardDescription": "Narrow unclear engineering issues into evidence gaps, likely ownership, and the next investigation path."
  }
}
```

本阶段禁止因为新增 card 字段而：

- 修改首页
- 接入首页自动生成
- 修改生成器
- 修改模板
- 修改 sitemap 或路由
- 新增栏目、排序、推荐位、是否展示等规则字段
- 批量重写所有 JSON

本阶段暂不新增：

- `showOnHome`
- `homeSection`
- `homeCategory`
- `featured`
- `order`
- `sort`
- `priority`
- `cardIcon`
- `cardTags`
- `menuGroup`
- `isRecommended`

旧页面处理策略：

1. 新增页面必须带 `zh.cardTitle`、`zh.cardDescription`、`en.cardTitle`、`en.cardDescription`。
2. 后续优化某个旧页面时，顺手补齐该页面 card 字段。
3. 不为了 card 字段一次性批量重写所有 JSON。
4. 等首页 / 目录生成规则确定后，再决定是否批量补齐剩余页面。

最终原则：

- 先补内容源，再谈展示规则。
- 卡片字段是内容资产，不等于首页生成规则。
- 本阶段只让 JSON 具备承载首页卡片内容的能力，不让首页自动消费这些字段。

后续优化 `problem-cause-analysis` 时，需要同步补齐：

- `zh.cardTitle`
- `zh.cardDescription`
- `en.cardTitle`
- `en.cardDescription`

---

## 14. Codex 执行约束

后续 Codex 执行 PromptForge 任务时必须遵守：

1. 先确认本次任务类型：审查、样板改造、批量迁移、新增页面、修复页面、修改首页。
2. 新增页面前必须先读取“已有 Prompt 页面登记表”。
3. 先搜索定位目标页面或组件。
4. 优先复用现有页面结构。
5. 只修改明确要求的页面。
6. 不顺手修改首页、路由、全局样式、构建配置。
7. 不把页面继续做成一次性大模板。
8. 不新增填写弹窗功能，除非任务明确要求且产品方向重新确认。
9. 如果新增通用组件，必须说明复用方式。
10. 如果执行测试或检查，必须输出命令和结果。
11. 禁止只说“已完成”，必须给出关键证据。
12. 完成后必须说明是否影响其他页面。
13. 如果发现页面结构异常，例如 `code/pre` 提前闭合，应在对应页面改造时顺手修复并说明。
14. 新增页面或优化旧 JSON 页面时，必须检查是否已补齐 `zh.cardTitle`、`zh.cardDescription`、`en.cardTitle`、`en.cardDescription`。
15. 不因为补 card 字段而新增首页展示规则、排序规则、推荐位字段或修改首页生成逻辑。

---

## 15. 默认完成报告要求

Codex 完成任务后，必须输出：

1. 修改文件清单
2. 页面结构变化
3. 复制区变化
4. 是否还有 `{{}}` 占位符
5. 是否更新 Prompt 页面登记表
6. 登记表新增 / 修改了哪一行
7. 是否发现相似页面
8. 是否影响首页、路由、全局样式、构建配置
9. 是否影响其他 Prompt 页面
10. 执行过的检查命令和结果
11. 关键证据，例如：
    - 页面路径
    - 页面标题
    - 角色 Prompt code id
    - 复制按钮文案
    - grep / rg 检查结果
12. 如果本次新增或优化了 `data/prompts/*.json`，还必须说明：
    - 是否存在 `zh.cardTitle`
    - 是否存在 `zh.cardDescription`
    - 是否存在 `en.cardTitle`
    - 是否存在 `en.cardDescription`
    - `cardTitle` 是否比 `title` 更短
    - `cardDescription` 是否比 `description` 更短
    - 中英文 card 字段语义是否一致
    - 是否没有新增首页展示规则字段
    - 是否没有修改首页生成逻辑
    - 是否没有因为 card 字段改动 sitemap 或路由

---

## 15. 当前已有 Prompt 页面登记表

当前 PromptForge v2 已收口为 **9 个主工作流页面**。

原则：

- 首页只展示 9 个主工作流入口。
- `data/prompts` 只保留 9 个主工作流 JSON。
- 旧 Prompt 大全已废弃，不再保留长尾 Prompt 页面作为独立资产。
- 已合并删除页面不要重复新增，除非重新确认产品方向和页面边界。
- 新增页面必须非常谨慎，必须先判断是否能并入现有 9 个主工作流，避免重新变成细分 Prompt 大全。
- 9 个主工作流 JSON 必须包含 `zh.cardTitle`、`zh.cardDescription`、`en.cardTitle`、`en.cardDescription`。

状态说明：

- 已保留：当前项目保留的主工作流页面。
- 已合并删除：能力已并入主工作流，独立 JSON 和页面不再保留，后续不要重复新增。

| 页面标题 | slug / 路由 | 类型 | 状态 | 核心场景 | 会话启动器改造 | 备注 |
|---|---|---|---|---|---|---|
| 线上问题排查工作流 | /problem-cause-analysis/ | 排查类 | 已保留 | 线上异常、接口失败、日志报错、表现不一致、Bug 定位、日志分析、最近变更排查 | 是 | 主工作流入口，合并 bug-location、log-analysis、api-timeout-analysis 第一批排查能力中的通用问题排查部分 |
| 性能与稳定性瓶颈分析工作流 | /api-performance-analysis/ | 优化类 | 已保留 | 接口变慢、超时、P95/P99 抖动、系统瓶颈、服务雪崩、依赖连锁异常 | 是 | 主工作流入口，合并 api-timeout-analysis、system-bottleneck-analysis、service-avalanche-analysis |
| SQL 与数据库优化工作流 | /slow-sql-optimization/ | 优化类 | 已保留 | 慢 SQL、索引失效、死锁、表结构、事务锁等待、执行计划、数据量和分页 | 是 | 主工作流入口，合并 index-failure-analysis、deadlock-troubleshooting、database-table-design |
| 缓存与 Redis 稳定性评审工作流 | /redis-usage-review/ | 评审类 | 已保留 | Redis 使用评审、缓存设计、Key、TTL、一致性、大 Key、热点 Key、穿透、击穿、雪崩 | 是 | 主工作流入口，合并 redis-bigkey-analysis、cache-design、cache-breakdown-avalanche-analysis |
| 接口上线前评审工作流 | /api-design-review/ | 评审类 | 已保留 | 接口设计、API 安全、权限、幂等、参数边界、错误码、兼容性、网关限流风险 | 是 | 主工作流入口，合并 api-security-design、gateway-rate-limit-design、permission-model-design |
| 分布式方案评审工作流 | /distributed-architecture-design/ | 方案类 | 已保留 | 分布式架构、数据一致性、分布式事务、MQ 丢失、MQ 重复消费、补偿、对账 | 是 | 主工作流入口，合并 distributed-transaction-solution、data-consistency-design、mq-message-loss-troubleshooting、mq-duplicate-consumption-handling |
| 发布与监控设计工作流 | /monitoring-alert-design/ | 方案类 | 已保留 | 灰度发布、监控报警、日志规范、上线观察、回滚条件、故障处理动作 | 是 | 主工作流入口，合并 gray-release-plan、logging-standard-design |
| Tech Lead 技术判断工作流 | /tech-lead-agent/ | 协作流 | 已保留 | 技术方案判断、复杂度控制、边界控制、风险识别和 Codex 执行前判断 | 是 | 主工作流入口，保留现有 Tech Lead Agent 能力 |
| Codex + GPT 开发协作流 | /codex-gpt-workflow/ | 协作流 | 已保留 | GPT 收敛需求和审查证据，Codex 执行代码，开发者控制最终决策 | 是 | 主工作流入口，保留现有 GPT / Codex 协作能力 |

已合并删除页面记录：

- `bug-location`、`log-analysis` 已合并进 `problem-cause-analysis`。
- `api-timeout-analysis`、`system-bottleneck-analysis`、`service-avalanche-analysis` 已合并进 `api-performance-analysis`。
- `index-failure-analysis`、`deadlock-troubleshooting`、`database-table-design` 已合并进 `slow-sql-optimization`。
- `redis-bigkey-analysis`、`cache-design`、`cache-breakdown-avalanche-analysis` 已合并进 `redis-usage-review`。
- `api-security-design`、`gateway-rate-limit-design`、`permission-model-design` 已合并进 `api-design-review`。
- `distributed-transaction-solution`、`data-consistency-design`、`mq-message-loss-troubleshooting`、`mq-duplicate-consumption-handling` 已合并进 `distributed-architecture-design`。
- `gray-release-plan`、`logging-standard-design` 已合并进 `monitoring-alert-design`。
- `concurrency-problem-analysis`、`gc-problem-analysis`、`jvm-parameter-tuning`、`thread-pool-configuration-optimization` 不再作为独立主入口保留；后续如需恢复，必须重新确认是否属于 9 个主工作流之外的新产品边界。

## 16. 首页与文案调整提醒

首页当前如果仍使用以下表达，后续需要跟随产品定位调整：

- 复制即用的开发者 Prompt 工具库
- 输入 xxx，输出 xxx
- 每个 Prompt 页面都按场景、输入、输出和使用说明组织

后续建议调整为：

- 开发者 AI 会话启动器
- 复制角色 Prompt，启动工程分析会话
- 下一条消息补充真实材料
- GPT / Codex 按约束追问、分析、输出

首页不需要在每次页面改造时顺手修改。

应在样板页验证通过后，再单独执行首页文案调整任务。
