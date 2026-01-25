# Localization Implementation Guide

## ✅ Completed Screens

The following screens have been fully localized:

### Onboarding Flow
- ✅ `app/onboarding/index.tsx` - Welcome screen
- ✅ `app/onboarding/period-length.tsx` - Period length selection
- ✅ `app/onboarding/cycle-length.tsx` - Cycle length selection
- ✅ `app/onboarding/last-period-date.tsx` - Last period date
- ✅ `app/onboarding/success.tsx` - Success screen

### Settings
- ✅ `app/(tabs)/settings.tsx` - Main settings screen
- ✅ `app/settings/calendar-view.tsx` - Calendar view settings

### Home
- ✅ `components/CycleOverviewWidget.tsx` - Main home widget

### Shared Components
- ✅ `components/Checkbox.tsx` - Checkbox component
- ✅ `components/DayPicker.tsx` - Day picker component
- ✅ `utils/localeUtils.ts` - Date formatting utilities

## 📋 Remaining Files to Translate

### High Priority (User-Facing Screens)

#### 1. Tab Navigation (`app/(tabs)/_layout.tsx`)
**Hardcoded text:**
- "Today" (tab label)
- "Calendar" (tab label)
- "Stats" (tab label, header)
- "Settings" (tab label, header)
- "Bluma" (header title)

**How to fix:**
```typescript
// Add to locales/en/common.json:
{
  "navigation": {
    "today": "Today",
    "calendar": "Calendar",
    "stats": "Stats",
    "settings": "Settings",
    "appName": "Bluma"
  }
}

// In _layout.tsx:
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('common');

// Use: t('navigation.today'), t('navigation.calendar'), etc.
```

#### 2. Edit Period Screen (`app/edit-period.tsx`)
**Hardcoded text:**
- "Edit Period"
- "Today" (button)
- "Period dates saved"
- "Error. Please try again."
- "Cancel"
- "Save"

**Where to add:** `locales/en/calendar.json` (already exists)

#### 3. Calendar Tab (`app/(tabs)/calendar.tsx`)
Needs review for any hardcoded text.

#### 4. Stats Tab (`app/(tabs)/stats.tsx`)
Needs review for stats labels and text.

#### 5. Theme Selection Modal (`components/ThemeSelectionModal.tsx`)
**Hardcoded text:**
- "Choose theme"

**Already translated** in `settings.json` but modal needs updating to use:
```typescript
const { t } = useTranslation('settings');
// Use t('themeOptions.system'), t('themeOptions.light'), t('themeOptions.dark')
```

### Medium Priority (Components)

#### 6. `components/CycleInsights.tsx`
#### 7. `components/QuickHealthSelector.tsx`
#### 8. `components/CycleHistory.tsx`
#### 9. `components/CycleDetails.tsx`
#### 10. `components/StatCard.tsx`
#### 11. `components/CalendarBottomSheet.tsx`
#### 12. `components/LinkButton.tsx`

### Settings Screens

#### 13. `app/settings/reminders.tsx`
#### 14. `app/settings/app-lock.tsx`
#### 15. `app/settings/pin-setup.tsx`
#### 16. `app/settings/about.tsx`
#### 17. `app/settings/privacy-policy.tsx`

### Info Screens

#### 18. `app/(info)/cycle-length-info.tsx`
#### 19. `app/(info)/cycle-phase-details.tsx`
#### 20. `app/(info)/late-period-info.tsx`
#### 21. `app/(info)/period-length-info.tsx`
#### 22. `app/(info)/prediction-info.tsx`

### Other Screens

#### 23. `app/health-tracking.tsx`
#### 24. `app/notes-editor.tsx`

## 🔄 Translation Workflow

For each file you translate:

### Step 1: Identify Hardcoded Strings
Look for any text a user will see:
```typescript
// ❌ Hardcoded
<Text>Edit Period</Text>
<Button title="Save" />
Alert.alert("Success", "Data saved")
```

### Step 2: Add to Appropriate Locale File
Choose the right namespace:
- **common.json** - Shared across app (buttons, errors)
- **onboarding.json** - Onboarding flow
- **calendar.json** - Calendar-related screens
- **settings.json** - Settings screens
- **health.json** - Symptoms, moods, flows
- **home.json** - Home screen
- **stats.json** - Statistics
- **info.json** - Info/help screens

### Step 3: Add English Translation
```json
// locales/en/calendar.json
{
  "editPeriod": {
    "title": "Edit Period",
    "today": "Today",
    "save": "Save",
    "cancel": "Cancel",
    "successMessage": "Period dates saved",
    "errorMessage": "Error. Please try again."
  }
}
```

### Step 4: Add Spanish Translation
```json
// locales/es/calendar.json
{
  "editPeriod": {
    "title": "Editar Periodo",
    "today": "Hoy",
    "save": "Guardar",
    "cancel": "Cancelar",
    "successMessage": "Fechas del periodo guardadas",
    "errorMessage": "Error. Por favor, inténtalo de nuevo."
  }
}
```

### Step 5: Update Component
```typescript
import { useTranslation } from 'react-i18next';

export default function EditPeriod() {
  const { t } = useTranslation('calendar');
  
  return (
    <View>
      <Text>{t('editPeriod.title')}</Text>
      <Button title={t('editPeriod.save')} />
    </View>
  );
}
```

## 🎯 Quick Example: Translating Edit Period

**Before:**
```typescript
// app/edit-period.tsx
<Text>Edit Period</Text>
<Button title="Save" onPress={handleSave} />
<Button title="Cancel" onPress={handleCancel} />
```

**After:**
```typescript
// app/edit-period.tsx
import { useTranslation } from 'react-i18next';

export default function EditPeriod() {
  const { t } = useTranslation('calendar');
  
  return (
    <>
      <Text>{t('editPeriod.title')}</Text>
      <Button title={t('common:buttons.save')} onPress={handleSave} />
      <Button title={t('common:buttons.cancel')} onPress={handleCancel} />
    </>
  );
}
```

## ⚠️ Common Pitfalls

1. **Don't forget Toast messages:**
   ```typescript
   // ❌ Wrong
   Toast.show({ text1: 'Saved successfully' });
   
   // ✅ Correct
   Toast.show({ text1: t('successMessage') });
   ```

2. **Don't forget Alert dialogs:**
   ```typescript
   // ❌ Wrong
   Alert.alert('Delete', 'Are you sure?');
   
   // ✅ Correct
   Alert.alert(t('deleteTitle'), t('deleteMessage'));
   ```

3. **Check placeholder text:**
   ```typescript
   // ❌ Wrong
   <TextInput placeholder="Enter notes" />
   
   // ✅ Correct
   <TextInput placeholder={t('notesPlaceholder')} />
   ```

## 📝 Translation Keys Already Available

You can reuse these from `common.json`:

- `t('common:buttons.save')` - "Save"
- `t('common:buttons.cancel')` - "Cancel"
- `t('common:buttons.delete')` - "Delete"
- `t('common:buttons.continue')` - "Continue"
- `t('common:buttons.back')` - "Back"
- `t('common:time.today')` - "Today"
- `t('common:time.days')` - "days"
- `t('common:loading')` - "Loading..."

## ✨ Benefits You're Getting

1. **Clean Code** - Components only have logic, no text
2. **Easy Updates** - Change copy in JSON, not in 50 files
3. **Bilingual App** - Switch between English/Spanish automatically
4. **Type Safety** - TypeScript will catch missing translation keys
5. **Professional** - Industry-standard approach used by major apps

## 🚀 Next Steps

1. Start with high-priority files (Tab layout, Edit Period)
2. Work through components one by one
3. Test in both English and Spanish
4. Review Spanish translations with native speaker
5. Consider adding more languages in the future!

## 💡 Tips

- Keep translation keys descriptive: `editPeriod.title` not `ep.t`
- Group related translations together
- Use nested objects for organization
- Always add both English AND Spanish when adding new text
- Test your changes to make sure translations work

