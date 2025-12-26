# Role-Based Tile Visibility Guide

This guide explains how to customize which dashboard tiles are visible to different user roles.

## Overview

The dashboard now uses a flexible role-based visibility system. Each tile (module) can specify which user roles can see it by adding a `roles` property.

## Current Configuration

Based on the current setup:
- **Students** see 5 tiles: My Lessons, Speaking Practice, Writing Practice, Listening Practice, AI Tutor
- **Teachers** see 6 tiles: All student tiles + Custom Content
- **Principal** and **Administrator** see ALL tiles (full access - no filtering applied)

## How to Customize

### Step 1: Open the Dashboard Component

Navigate to `src/components/Dashboard.tsx`

### Step 2: Find the Module You Want to Modify

Each module in the `modules` array has properties like:
```typescript
{
  id: "custom-content",
  title: "Custom Content",
  description: "Create and manage custom materials",
  icon: FileBracket,
  color: "from-[#3B82F6] to-[#00B9FC]",
  progress: 0,
  lessons: 0,
  roles: ["teacher"], // <-- This controls visibility
}
```

### Step 3: Modify the `roles` Property

The `roles` property accepts an array of role names (strings). Here are examples:

#### Example 1: Make a tile visible only to teachers
```typescript
{
  id: "custom-content",
  // ... other properties
  roles: ["teacher"], // Only teachers can see this
}
```

#### Example 2: Make a tile visible only to students
```typescript
{
  id: "connect-teacher",
  // ... other properties
  roles: ["student"], // Only students can see this
}
```

#### Example 3: Make a tile visible to multiple roles
```typescript
{
  id: "my-lessons",
  // ... other properties
  roles: ["student", "teacher", "administrator"], // All these roles can see this
}
```

#### Example 4: Make a tile visible to everyone
```typescript
{
  id: "ai-tutor",
  // ... other properties
  roles: [], // Empty array = visible to all roles
  // OR simply omit the roles property
}
```

### Step 4: Adding New Roles

If your API returns new roles (e.g., "administrator", "parent", "guest"), you can use them directly:

```typescript
{
  id: "admin-panel",
  title: "Admin Panel",
  // ... other properties
  roles: ["administrator"], // New role from API
}
```

**Note:** The role name must match exactly what comes from the API response (`data.user.role`). The comparison is case-insensitive, so "Teacher", "TEACHER", and "teacher" all work.

**Special Roles:**
- **"principal"** and **"administrator"** roles automatically have full access and see ALL tiles regardless of the `roles` property
- These roles bypass the filtering logic entirely

## Common Use Cases

### Use Case 1: Add a new tile that only administrators see

```typescript
{
  id: "admin-dashboard",
  title: "Admin Dashboard",
  description: "Manage system settings",
  icon: Settings, // Import from lucide-react
  color: "from-[#EF4444] to-[#DC2626]",
  progress: 0,
  lessons: 0,
  roles: ["administrator"],
}
```

### Use Case 2: Make a tile visible to both students and teachers, but not guests

```typescript
{
  id: "premium-content",
  title: "Premium Content",
  // ... other properties
  roles: ["student", "teacher"], // Students and teachers only
}
```

### Use Case 3: Change existing tile visibility

To change who can see "Custom Content":
1. Find the module with `id: "custom-content"`
2. Modify the `roles` array:
   ```typescript
   roles: ["student", "teacher"], // Now both can see it
   ```

### Use Case 4: Hide a tile from a specific role

To hide a tile from a role, simply remove that role from the array:
```typescript
// Before: visible to both
roles: ["student", "teacher"]

// After: only visible to students
roles: ["student"]
```

## How It Works (Technical Details)

The filtering happens in the `filteredModules` useMemo hook:

1. If a module has no `roles` property or an empty array → visible to everyone
2. If a module has a `roles` array → checks if current `userRole` is in that array
3. Comparison is case-insensitive
4. If no user role is set, all modules are shown (fallback)

## Testing

To test your changes:

1. Login as a user with the role you want to test
2. Navigate to the dashboard
3. Verify that only tiles with your role (or no role restriction) are visible
4. Logout and login as a different role to verify filtering works correctly

## Troubleshooting

### Issue: Tile is not showing up

**Check:**
- Is the `roles` array correct? Make sure the role name matches the API response exactly
- Is the role name case-sensitive? (It shouldn't be, but check for typos)
- Did you save the file? Make sure your changes are saved

### Issue: Tile is showing for wrong roles

**Solution:**
- Verify the `roles` array contains only the intended roles
- Check that there are no typos in role names
- Remember: empty array or no `roles` property = visible to everyone

### Issue: Need to add a completely new role

**Solution:**
1. The role name should come from your API (`data.user.role`)
2. Simply use that role name in the `roles` array
3. No additional configuration needed - the system automatically handles new roles

## Example: Complete Module Configuration

Here's a complete example of a module with all properties:

```typescript
{
  id: "my-new-module",
  title: "My New Module",
  description: "Description of what this module does",
  icon: BookOpen, // Must be imported from lucide-react
  color: "from-[#3B82F6] to-[#00B9FC]", // Tailwind gradient classes
  progress: 75, // 0-100, or 0 if not applicable
  lessons: 12, // Number of lessons, or 0 if not applicable
  isNew: true, // Optional: adds a "NEW" badge
  roles: ["student", "teacher"], // Who can see this tile
}
```

## Questions?

If you need to customize visibility in more complex ways (e.g., based on permissions, user subscriptions, etc.), you can extend the filtering logic in the `filteredModules` useMemo hook.

