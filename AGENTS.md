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

## 13. Codex 执行约束

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

---

## 14. 默认完成报告要求

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

---

## 15. 当前已有 Prompt 页面登记表

状态说明：

- 已上线：页面已存在，但不代表已符合最新会话启动器标准
- 待重做：旧式模板或内容不符合当前标准
- 待改造：内容有价值，但需要迁移为会话启动器结构
- 已改造：已按“角色 Prompt / 输入参考 / 输出预览 / 使用说明”结构完成
- 草稿：尚未正式上线

| 页面标题 | slug / 路由 | 类型 | 状态 | 核心场景 | 会话启动器改造 | 备注 |
|---|---|---|---|---|---|---|
| 慢SQL优化 Prompt | /slow-sql-optimization/ | 优化类 | 已改造 | MySQL 慢查询、EXPLAIN、索引优化、深分页 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 接口设计评审 Prompt | /api-design-review/ | 评审类 | 已改造 | 后端接口幂等性、安全性、扩展性、事务边界评审 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 灰度发布方案 Prompt | /gray-release-plan/ | 方案类 | 已改造 | 灰度对象、放量策略、监控、回滚、feature flag | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 日志分析 Prompt | /log-analysis/ | 排查类 | 已改造 | Java / Spring Boot 日志、堆栈、接口异常分析 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览结构改造 |
| Bug定位 Prompt | /bug-location/ | 排查类 | 已改造 | 前后端 Bug 根因定位、复现、接口、日志、最近改动 | 是 | 已按会话启动器样板完成一致性检查和结构同步 |
| Redis使用评审 Prompt | /redis-usage-review/ | 评审类 | 已改造 | Redis key、TTL、数据结构、并发一致性评审 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 分布式事务方案 Prompt | /distributed-transaction-solution/ | 方案类 | 已改造 | 最终一致性、幂等、补偿、重试、对账方案 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| Codex + GPT 开发协作流 | /codex-gpt-workflow/ | 协作流 | 已改造 | GPT 负责收敛审查，Codex 负责执行代码 | 是 | 已改造为开发协作会话启动器，突出 GPT / Codex / 用户职责边界 |
| API安全设计 Prompt | /api-security-design/ | 评审类 | 已改造 | API 权限、鉴权、参数安全、越权风险 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 接口超时问题排查 Prompt | /api-timeout-analysis/ | 排查类 | 已改造 | 接口慢、超时、调用链耗时定位 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 缓存击穿/雪崩分析 Prompt | /cache-breakdown-avalanche-analysis/ | 排查类 | 已改造 | 缓存击穿、雪崩、热点 key 风险分析 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 数据一致性设计 Prompt | /data-consistency-design/ | 方案类 | 已改造 | 多表、多服务、异步任务、最终一致性设计 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 死锁问题排查 Prompt | /deadlock-troubleshooting/ | 排查类 | 已改造 | MySQL / Java 并发死锁排查 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 网关限流设计 Prompt | /gateway-rate-limit-design/ | 方案类 | 已改造 | 网关限流、降级、保护核心接口 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| GC问题分析 Prompt | /gc-problem-analysis/ | 排查类 | 已改造 | JVM GC 日志、停顿、内存压力分析 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 索引失效分析 Prompt | /index-failure-analysis/ | 优化类 | 已改造 | MySQL 索引失效、执行计划分析 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| JVM参数调优 Prompt | /jvm-parameter-tuning/ | 优化类 | 已改造 | JVM 参数、堆内存、GC 策略调优 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 日志规范设计 Prompt | /logging-standard-design/ | 方案类 | 已改造 | 日志字段、链路追踪、错误日志规范 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 监控报警设计 Prompt | /monitoring-alert-design/ | 方案类 | 已改造 | 指标、告警阈值、异常处理策略 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| MQ重复消费处理 Prompt | /mq-duplicate-consumption-handling/ | 排查类 | 已改造 | MQ 消费幂等、重复消息处理 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| MQ消息丢失排查 Prompt | /mq-message-loss-troubleshooting/ | 排查类 | 已改造 | MQ 生产、投递、消费链路丢失排查 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 权限模型设计 Prompt | /permission-model-design/ | 方案类 | 已改造 | RBAC、角色权限、数据权限设计 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| Redis大Key问题分析 Prompt | /redis-bigkey-analysis/ | 排查类 | 已改造 | Redis big key 识别、风险、拆分方案 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 服务雪崩分析 Prompt | /service-avalanche-analysis/ | 排查类 | 已改造 | 依赖故障、超时、线程池耗尽、雪崩定位 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 系统瓶颈定位 Prompt | /system-bottleneck-analysis/ | 排查类 | 已改造 | CPU、内存、DB、Redis、接口瓶颈定位 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 线程池配置优化 Prompt | /thread-pool-configuration-optimization/ | 优化类 | 已改造 | Java 线程池参数、队列、拒绝策略优化 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 接口性能分析 Prompt | /api-performance-analysis/ | 优化类 | 已改造 | 接口耗时、瓶颈、SQL、缓存、外部调用分析 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 缓存设计 Prompt | /cache-design/ | 方案类 | 已改造 | 缓存 key、TTL、一致性、穿透击穿雪崩设计 | 是 | 已按会话启动器结构改造，并修复 Prompt 区 HTML 提前闭合问题 |
| 并发问题分析 Prompt | /concurrency-problem-analysis/ | 排查类 | 已改造 | 并发冲突、重复提交、线程安全、锁问题 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 数据库表设计 Prompt | /database-table-design/ | 方案类 | 已改造 | 表结构、字段、索引、约束、扩展性设计 | 是 | 已按角色 Prompt / 下一条消息示例 / 输出效果预览 / 使用说明结构改造 |
| 分布式架构设计 Prompt | /distributed-architecture-design/ | 方案类 | 已改造 | 单体拆分、服务边界、调用链路、数据归属、一致性和高可用治理 | 是 | 已按角色 Prompt / 你接下来可以这样输入 / GPT 会这样输出 / 使用说明结构优化；全站审查未发现页面内旧式 {{}} 占位符 |
| 问题原因分析 Prompt | /problem-cause-analysis/ | 排查类 | 已改造 | 通用问题原因分析和排查路径 | 是 | 已改造为通用兜底排查会话启动器，并提示必要时切换到具体领域页 |
| PromptForge English Home | /en/ | 首页 | 已改造 | 英文用户理解 PromptForge、GPT / Codex / Developer 协作模型与英文 MVP 导航 | 是 | 英文 MVP 首页，静态 HTML；未纳入 sitemap，留给后续任务 |
| Codex + GPT Coding Workflow Prompt | /en/codex-gpt-workflow/ | 协作流 | 已改造 | 英文版 GPT 澄清和审查、Codex 执行代码、开发者控制合并决策 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Bug Investigation Prompt | /en/bug-location/ | 排查类 | 已改造 | 英文版生产 Bug 根因定位、复现、接口、日志、数据和最近改动分析 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Slow SQL Optimization Prompt | /en/slow-sql-optimization/ | 优化类 | 已改造 | 英文版慢 SQL、EXPLAIN、索引、表结构、数据量和回滚计划分析 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| API Design Review Prompt | /en/api-design-review/ | 评审类 | 已改造 | 英文版 API 幂等性、安全性、扩展性、失败场景和上线阻断项评审 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Redis Usage Review Prompt | /en/redis-usage-review/ | 评审类 | 已改造 | 英文版 Redis key、TTL、数据结构、一致性、热 key 和缓存风险评审 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Monitoring and Alert Design Prompt | /en/monitoring-alert-design/ | 方案类 | 已改造 | 英文版监控目标、关键指标、告警阈值、升级路径、降噪和发布验证设计 | 是 | 英文 MVP 页面，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Log Analysis Prompt for Developers | /en/log-analysis/ | 排查类 | 已改造 | 英文版日志、异常堆栈、请求时间线、trace ID、服务链路和最近变更分析 | 是 | 英文版 Prompt 页面，对应中文 /log-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| API Timeout Analysis Prompt | /en/api-timeout-analysis/ | 排查类 | 已改造 | 英文版接口超时、响应慢、调用链阻塞、下游依赖、数据库、缓存和资源池分析 | 是 | 英文版 Prompt 页面，对应中文 /api-timeout-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| GC Problem Analysis Prompt | /en/gc-problem-analysis/ | 排查类 | 已改造 | 英文版 JVM GC 频繁、Full GC、STW、内存增长、OOM 风险和吞吐下降分析 | 是 | 英文版 Prompt 页面，对应中文 /gc-problem-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| JVM Parameter Tuning Prompt | /en/jvm-parameter-tuning/ | 优化类 | 已改造 | 英文版 JVM 参数、GC 日志、服务负载、容器限制、延迟目标和回滚方案评审 | 是 | 英文版 Prompt 页面，对应中文 /jvm-parameter-tuning/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Index Failure Analysis Prompt | /en/index-failure-analysis/ | 优化类 | 已改造 | 英文版 MySQL 索引失效、优化器选错索引、谓词匹配、最左前缀和执行计划分析 | 是 | 英文版 Prompt 页面，对应中文 /index-failure-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Distributed Transaction Solution Prompt | /en/distributed-transaction-solution/ | 方案类 | 已改造 | 英文版分布式事务方案评审、业务边界、一致性模型、补偿、幂等、消息可靠性和回滚风险 | 是 | 英文版 Prompt 页面，对应中文 /distributed-transaction-solution/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Data Consistency Design Prompt | /en/data-consistency-design/ | 方案类 | 已改造 | 英文版跨服务、跨表、缓存、MQ、异步任务和外部回调一致性设计 | 是 | 英文版 Prompt 页面，对应中文 /data-consistency-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| MQ Message Loss Troubleshooting Prompt | /en/mq-message-loss-troubleshooting/ | 排查类 | 已改造 | 英文版 MQ 消息丢失、未投递、未消费、重试失败、死信堆积和业务未生效排查 | 是 | 英文版 Prompt 页面，对应中文 /mq-message-loss-troubleshooting/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| MQ Duplicate Consumption Handling Prompt | /en/mq-duplicate-consumption-handling/ | 排查类 | 已改造 | 英文版 MQ 重复消费处理、业务幂等、去重键、事务边界、重试和副作用控制 | 是 | 英文版 Prompt 页面，对应中文 /mq-duplicate-consumption-handling/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Cache Breakdown and Avalanche Analysis Prompt | /en/cache-breakdown-avalanche-analysis/ | 排查类 | 已改造 | 英文版缓存穿透、击穿、雪崩、热点 key、大 key、TTL 集中失效和数据库压力分析 | 是 | 英文版 Prompt 页面，对应中文 /cache-breakdown-avalanche-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| API Performance Analysis Prompt | /en/api-performance-analysis/ | 优化类 | 已改造 | 英文版接口耗时、调用链、SQL、缓存、下游依赖和资源瓶颈分析 | 是 | 英文版 Prompt 页面，对应中文 /api-performance-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| API Security Design Prompt | /en/api-security-design/ | 评审类 | 已改造 | 英文版 API 鉴权、授权、敏感数据、重放、防刷、签名和审计设计 | 是 | 英文版 Prompt 页面，对应中文 /api-security-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Cache Design Prompt | /en/cache-design/ | 方案类 | 已改造 | 英文版缓存 key、TTL、一致性、穿透、击穿、雪崩、预热和降级设计 | 是 | 英文版 Prompt 页面，对应中文 /cache-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Concurrency Problem Analysis Prompt | /en/concurrency-problem-analysis/ | 排查类 | 已改造 | 英文版并发冲突、重复提交、线程安全、锁、幂等和事务边界分析 | 是 | 英文版 Prompt 页面，对应中文 /concurrency-problem-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Database Table Design Prompt | /en/database-table-design/ | 方案类 | 已改造 | 英文版数据库表结构、字段、索引、约束、查询模式和迁移风险设计 | 是 | 英文版 Prompt 页面，对应中文 /database-table-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Deadlock Troubleshooting Prompt | /en/deadlock-troubleshooting/ | 排查类 | 已改造 | 英文版数据库或应用死锁、锁等待、事务 SQL、索引和隔离级别排查 | 是 | 英文版 Prompt 页面，对应中文 /deadlock-troubleshooting/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Distributed Architecture Design Prompt | /en/distributed-architecture-design/ | 方案类 | 已改造 | 英文版分布式架构、服务边界、数据归属、通信、一致性和可观测性设计 | 是 | 英文版 Prompt 页面，对应中文 /distributed-architecture-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Gateway Rate Limit Design Prompt | /en/gateway-rate-limit-design/ | 方案类 | 已改造 | 英文版网关限流、调用方维度、QPS、突发流量、降级、防刷和监控设计 | 是 | 英文版 Prompt 页面，对应中文 /gateway-rate-limit-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Gray Release Plan Prompt | /en/gray-release-plan/ | 方案类 | 已改造 | 英文版灰度发布、放量节奏、观察窗口、指标、暂停条件、回滚和兼容性计划 | 是 | 英文版 Prompt 页面，对应中文 /gray-release-plan/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Logging Standard Design Prompt | /en/logging-standard-design/ | 方案类 | 已改造 | 英文版日志字段、trace ID、业务 ID、错误码、日志级别、脱敏和审计规范设计 | 是 | 英文版 Prompt 页面，对应中文 /logging-standard-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Permission Model Design Prompt | /en/permission-model-design/ | 方案类 | 已改造 | 英文版权限模型、角色、资源、动作、数据范围、归属、管理员边界和审计设计 | 是 | 英文版 Prompt 页面，对应中文 /permission-model-design/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Problem Cause Analysis Prompt | /en/problem-cause-analysis/ | 排查类 | 已改造 | 英文版通用问题原因分析、事实假设拆分、证据收敛和最小排查路径 | 是 | 英文版 Prompt 页面，对应中文 /problem-cause-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Redis Big Key Analysis Prompt | /en/redis-bigkey-analysis/ | 排查类 | 已改造 | 英文版 Redis big key 识别、内存倾斜、命令延迟、拆分、迁移和验证分析 | 是 | 英文版 Prompt 页面，对应中文 /redis-bigkey-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Service Avalanche Analysis Prompt | /en/service-avalanche-analysis/ | 排查类 | 已改造 | 英文版服务雪崩、依赖故障、超时放大、重试风暴、线程池耗尽和隔离分析 | 是 | 英文版 Prompt 页面，对应中文 /service-avalanche-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| System Bottleneck Analysis Prompt | /en/system-bottleneck-analysis/ | 排查类 | 已改造 | 英文版系统瓶颈、CPU、内存、DB、Redis、MQ、线程池、连接池和队列定位 | 是 | 英文版 Prompt 页面，对应中文 /system-bottleneck-analysis/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |
| Thread Pool Configuration Optimization Prompt | /en/thread-pool-configuration-optimization/ | 优化类 | 已改造 | 英文版 Java 线程池参数、队列、拒绝策略、下游容量、监控和回滚评审 | 是 | 英文版 Prompt 页面，对应中文 /thread-pool-configuration-optimization/，按 Role Prompt / What to provide next / Expected output preview / Usage notes 结构新增 |

---

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
