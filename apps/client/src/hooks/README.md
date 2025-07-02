# Custom Hooks

This directory contains custom React hooks used throughout the application.

## useAuthToken

A custom hook that provides authentication token functionality by wrapping Clerk's `useAuth` hook.

### Usage

```tsx
import { useAuthToken } from "@/hooks/useAuthToken";

function MyComponent() {
  const { getToken } = useAuthToken();

  const fetchData = async () => {
    const token = await getToken();
    // Use token for API calls
  };

  return <div>...</div>;
}
```

### Benefits

- **Centralized error handling**: Automatically handles token retrieval errors
- **Consistent interface**: Provides a uniform way to get tokens across the app
- **Easy to test**: Can be mocked easily for unit tests
- **Future-proof**: If we need to change authentication providers, we only need to update this hook

### Files Updated

This hook replaces direct usage of `useAuth` and `getToken` in the following files:

- KanbanBoard.tsx
- Members.tsx
- ProjectInfo.tsx
- TaskInfo.tsx
- SideBar.tsx
- Inbox.tsx
- FormModal.tsx
- Settings.tsx
- AddTaskModal.tsx
- Sprint.tsx
- SprintFormModal.tsx
- Roadmap.tsx
- Calendar.tsx
- CalenderTaskModal.tsx

Total: **14 components** migrated to use the custom hook.
