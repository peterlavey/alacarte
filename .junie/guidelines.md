# Guidelines for Task Management

This project follows a spec-driven development approach. The source of truth for tasks is `docs/tasks.md`.

## How to work with the Task List

1.  **Check off tasks**: Mark tasks as completed by changing `[ ]` to `[x]` in `docs/tasks.md`.
2.  **Maintain Structure**: Do not remove the phase headers or the logical grouping of tasks.
3.  **Traceability**:
    - Every task must link back to a Plan Item (e.g., `(Plan: 2.1)`) and, where applicable, a Requirement (e.g., `(Req: 1)`).
    - If you add new tasks, ensure they include these references.
4.  **Evolution**:
    - If technical details change, update the task description but keep the original goal intact.
    - If a new requirement arises, update `docs/requirements.md` and `docs/plan.md` first, then add the corresponding tasks here.