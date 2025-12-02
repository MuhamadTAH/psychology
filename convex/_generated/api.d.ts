/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alerts from "../alerts.js";
import type * as analytics from "../analytics.js";
import type * as analyticsQueries from "../analyticsQueries.js";
import type * as auth from "../auth.js";
import type * as characterCustomization from "../characterCustomization.js";
import type * as darkPsychology from "../darkPsychology.js";
import type * as darkPsychologyDB from "../darkPsychologyDB.js";
import type * as gamification from "../gamification.js";
import type * as leagues from "../leagues.js";
import type * as lessonMigration from "../lessonMigration.js";
import type * as lessons from "../lessons.js";
import type * as migrationHelper from "../migrationHelper.js";
import type * as onboarding from "../onboarding.js";
import type * as settings from "../settings.js";
import type * as shop from "../shop.js";
import type * as users from "../users.js";
import type * as weakAreas from "../weakAreas.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  analytics: typeof analytics;
  analyticsQueries: typeof analyticsQueries;
  auth: typeof auth;
  characterCustomization: typeof characterCustomization;
  darkPsychology: typeof darkPsychology;
  darkPsychologyDB: typeof darkPsychologyDB;
  gamification: typeof gamification;
  leagues: typeof leagues;
  lessonMigration: typeof lessonMigration;
  lessons: typeof lessons;
  migrationHelper: typeof migrationHelper;
  onboarding: typeof onboarding;
  settings: typeof settings;
  shop: typeof shop;
  users: typeof users;
  weakAreas: typeof weakAreas;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
