import { create } from "zustand";
import { MeshStandardMaterial } from "three";

export const PHOTO_POSES = {
  Idle: "Idle",
  Chill: "Chill",
  Cool: "Cool",
  Punch: "Punch",
  Ninja: "Ninja",
  King: "King",
  Busy: "Busy",
};

export const UI_MODES = {
  PHOTO: "photo",
  CUSTOMIZE: "customize",
};

interface ColorPalette {
  _id: string;
  name: string;
  colors: string[];
}

interface Asset {
  _id: string;
  groupId: string;
  name: string;
  assetUrl: string;
  thumbnailUrl?: string;
  lockedGroups?: string[];
}

interface CustomizationGroup {
  _id: string;
  name: string;
  position: number;
  removable?: boolean;
  colorPaletteId?: string;
  assets: Asset[];
  colorPalette?: ColorPalette;
}

interface Customization {
  [key: string]: {
    asset?: Asset | null;
    color?: string;
  };
}

interface ConfiguratorStore {
  loading: boolean;
  mode: string;
  setMode: (mode: string) => void;
  pose: string;
  setPose: (pose: string) => void;
  categories: CustomizationGroup[];
  currentCategory: CustomizationGroup | null;
  lockedGroups: { [key: string]: any[] };
  skin: MeshStandardMaterial;
  customization: Customization;
  download: () => void;
  setDownload: (download: () => void) => void;
  screenshot: () => void;
  setScreenshot: (screenshot: () => void) => void;
  updateColor: (color: string) => void;
  updateSkin: (color: string) => void;
  setCurrentCategory: (category: CustomizationGroup) => void;
  changeAsset: (category: string, asset: Asset | null) => void;
  randomize: () => void;
  applyLockedAssets: () => void;
  setCategories: (categories: CustomizationGroup[]) => void;
}

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  loading: true,
  mode: UI_MODES.CUSTOMIZE,
  setMode: (mode) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose) => set({ pose }),
  categories: [],
  currentCategory: null,
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  customization: {},
  download: () => {},
  setDownload: (download) => set({ download }),
  screenshot: () => {},
  setScreenshot: (screenshot) => set({ screenshot }),

  updateColor: (color) => {
    const currentCategory = get().currentCategory;
    if (!currentCategory) return;

    set((state) => ({
      customization: {
        ...state.customization,
        [currentCategory.name]: {
          ...state.customization[currentCategory.name],
          color,
        },
      },
    }));

    if (currentCategory.name === "Head") {
      get().updateSkin(color);
    }
  },

  updateSkin: (color) => {
    get().skin.color.set(color);
  },

  setCurrentCategory: (category) => set({ currentCategory: category }),

  changeAsset: (category, asset) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [category]: {
          ...state.customization[category],
          asset,
        },
      },
    }));
    get().applyLockedAssets();
  },

  randomize: () => {
    const customization: Customization = {};
    get().categories.forEach((category) => {
      if (category.assets.length === 0) return;

      const randomIndex = Math.floor(Math.random() * category.assets.length);
      let randomAsset: Asset | null = category.assets[randomIndex];

      if (category.removable) {
        if (Math.floor(Math.random() * category.assets.length) === 0) {
          randomAsset = null;
        }
      }

      const randomColor = category.colorPalette?.colors
        ? category.colorPalette.colors[
            Math.floor(Math.random() * category.colorPalette.colors.length)
          ]
        : undefined;

      customization[category.name] = {
        asset: randomAsset,
        color: randomColor,
      };

      if (category.name === "Head" && randomColor) {
        get().updateSkin(randomColor);
      }
    });
    set({ customization });
    get().applyLockedAssets();
  },

  applyLockedAssets: () => {
    const customization = get().customization;
    const categories = get().categories;
    const lockedGroups: { [key: string]: any[] } = {};

    Object.values(customization).forEach((category) => {
      if (category.asset?.lockedGroups) {
        category.asset.lockedGroups.forEach((groupId) => {
          const cat = categories.find((c) => c._id === groupId);
          if (cat) {
            if (!lockedGroups[cat.name]) {
              lockedGroups[cat.name] = [];
            }
            const lockingAssetCategory = categories.find(
              (c) => c._id === category.asset!.groupId
            );
            lockedGroups[cat.name].push({
              name: category.asset.name,
              categoryName: lockingAssetCategory?.name,
            });
          }
        });
      }
    });

    set({ lockedGroups });
  },

  setCategories: (categories) => {
    const customization: Customization = {};

    categories.forEach((category) => {
      const firstAsset = category.assets[0];
      customization[category.name] = {
        asset: firstAsset,
        color: category.colorPalette?.colors?.[0] || "",
      };
    });

    set({
      categories,
      currentCategory: categories[0] || null,
      customization,
      loading: false,
    });
  },
}));
