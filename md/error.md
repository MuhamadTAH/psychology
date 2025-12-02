Runtime Error


[CONVEX Q(characterCustomization:getCustomizationGroups)] [Request ID: 1e19e315ebb76a70] Server Error
Could not find public function for 'characterCustomization:getCustomizationGroups'. Did you forget to run `npx convex dev` or `npx convex deploy`?

  Called by client

Call Stack
20

Hide 20 ignore-listed frame(s)
OptimisticQueryResults.queryResult
node_modules/convex/src/browser/sync/optimistic_updates_impl.ts (230:13)
BaseConvexClient.localQueryResult
node_modules/convex/src/browser/sync/client.ts (702:40)
Object.localQueryResult
node_modules/convex/src/react/client.ts (414:34)
QueriesObserver.getLocalResults
node_modules/convex/src/react/queries_observer.ts (99:23)
useQueriesHelper.useMemo[subscription]
node_modules/convex/src/react/use_queries.ts (104:25)
useSubscription.useEffect.checkForUpdates
node_modules/convex/src/react/use_subscription.ts (117:23)
basicStateReducer
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (7065:45)
dispatchSetStateInternal
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (8233:28)
dispatchSetState
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (8208:7)
useSubscription.useEffect.checkForUpdates
node_modules/convex/src/react/use_subscription.ts (102:7)
QueriesObserver.notifyListeners
node_modules/convex/src/react/queries_observer.ts (165:7)
<unknown>
node_modules/convex/src/react/queries_observer.ts (145:51)
ConvexReactClient.transition
node_modules/convex/src/react/client.ts (595:11)
<unknown>
node_modules/convex/src/react/client.ts (305:32)
<unknown>
node_modules/convex/src/browser/sync/client.ts (355:7)
BaseConvexClient.handleTransition
node_modules/convex/src/browser/sync/client.ts (600:7)
BaseConvexClient.notifyOnQueryResultChanges
node_modules/convex/src/browser/sync/client.ts (576:10)
WebSocketManager.onMessage
node_modules/convex/src/browser/sync/client.ts (453:20)
ws.onmessage
node_modules/convex/src/browser/sync/web_socket_manager.ts (323:29)
ClientPageRoot
node_modules/next/src/client/components/client-page.tsx (60:12)