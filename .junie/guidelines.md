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

# Testing

1.  **Test Coverage**: Ensure that all tasks are covered by tests.
2.  **Test Plan**: Create a test plan for each task.
3.  **Test Execution**: Execute the tests for each task.
4.  **Test Review**: Review the test results and update the task accordingly.
5.  **Test Re-execution**: Re-execute the tests if necessary.
6.  **Test Retrospective**: Conduct a retrospective to reflect on the testing process.
7.  **Test Retrospective Report**: Write a report summarizing the testing process.

# JavaScript & React Project Guidelines

## General Principles
*   **clean arquitecture**: Clean Architecture principles, SOLID, DRY, KISS, etc.
*   **solid principles**: SOLID, DRY, KISS, YAGNI, etc.
*   **Keep it Simple**: Keep the code base simple and easy to understand.
*   **Keep it Fast**: Avoid unnecessary network requests and unnecessary rendering.
*   **Keep it Functional**: Avoid side effects and mutable state.
*   **Keep it Clean**: Keep the code base clean and organized.
*   **Keep it Modern**: Use the latest JavaScript features and syntax.
*   **Keep it Consistent**: Follow the same coding style and conventions throughout the project.
*   **Keep it DRY**: Avoid code duplication.
*   **Keep it Simple**: Avoid unnecessary complexity.
*   **Prioritize Function Components and Hooks**: Always use modern React function components and hooks instead of class components.
*   **TypeScript Preference**: For all new files, prefer TypeScript (`.tsx` or `.ts`) over plain JavaScript (`.jsx` or `.js`) where possible.
*   **Code Quality**: Ensure all changes pass ESLint and Prettier checks.
*   **Testing**: Add unit tests for new logic using the `vitest` framework in a `__tests__` directory adjacent to the component/file being tested.

## React Specifics
*   **File Structure**: Place components in `src/components`, utility functions in `src/utils`, and pages/views in `src/pages`.
*   **Component Structure**: Place component and related styles in the same directory even if doesn't have a style file, (e.g. `src/components/UserProfile/UserProfile.tsx` and `src/components/UserProfile/UserProfile.module.css`).
*   **Naming Conventions**: Use PascalCase for component names (e.g., `UserProfile.tsx`) and camelCase for all other JavaScript files and variables.
*   **Prop Types/Interfaces**: Define explicit `interface` for component props in TypeScript files.
*   **Avoid Inline Styles**: Use CSS modules or Tailwind CSS for styling instead of inline `style` objects.

## Git & PR Process
*   **Commit Messages**: Use conventional commit messages based on `@commitlint/config-conventional`.
    *   **Format**: `<type>(<scope>): <description>` (scope is optional).
    *   **Common Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
    *   **Rules**:
        *   Type and subject are required.
        *   Subject must not end with a period.
        *   Type must be lowercase.
*   **Plan First**: For large tasks, ask Junie to propose an execution plan first and wait for approval before starting implementation.