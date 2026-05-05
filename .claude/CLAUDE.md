# CLAUDE.md — GAgentManager

## PRD 编写/修改规则

**编写或修改 PRD 文档时，必须使用 `design-prd` 技能，禁止手动编写或修改 PRD 文件。**

当用户要求写 PRD 文档时，严格按照以下顺序执行，不可跳过或合并步骤：

1. **brainstorm** — 先用 brainstorm 技能探索需求、收集想法、明确业务目标
2. **design-prd** — 再用 design-prd 技能将结果结构化为正式 PRD 文档
3. **writing-plans** — 最后用 writing-plans 技能拆解实施计划

## 技术方案编写/修改规则

**编写或修改技术方案文档时，必须使用 `design-technical-solution` 技能，禁止手动编写或修改技术方案文件。**

## 后端 README 同步

每次修改后端代码后，必须同步检查并更新 `backend/README.md`，确保文档与实际代码（模块结构、技术栈、功能模块、配置等）保持一致。
