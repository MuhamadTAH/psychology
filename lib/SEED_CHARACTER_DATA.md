# Seed Character Data

To populate the character customization database, follow these steps:

## 1. Make sure Convex is running
```bash
npm run dev
```

## 2. Run the seed function from Convex dashboard

1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Go to "Functions" tab
4. Find `characterCustomization:seedCharacterData`
5. Click "Run" to execute the seed function

This will create:
- 3 color palettes (Skin Tones, Hair Colors, Eye Colors)
- 3 customization groups (Head, Hair, Eyes)

## 3. Add 3D Assets

After seeding, you need to:

1. Upload .glb files to Convex storage
2. Create asset records linking to those files

### Using Convex Dashboard:

1. Go to "Data" tab
2. Select `customizationAssets` table
3. Click "Add Document"
4. Fill in:
   - groupId: (select from customizationGroups)
   - name: "Head Style 1"
   - assetUrl: (upload .glb file to storage first, then use the URL)
   - thumbnailUrl: (optional)

## Next Steps

Once data is seeded, the character page at `/character` will display the UI with:
- Category tabs (Head, Hair, Eyes)
- Color pickers
- Asset selection

The 3D scene will be added in the next step of the tutorial.
