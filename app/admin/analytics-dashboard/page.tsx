// 🧠 FILE PURPOSE
// Admin Analytics Dashboard with visual charts and key metrics.
// Displays important data like user growth, lesson stats, engagement, streaks, etc.
// Built with Next.js 15, React 19, Convex, and Recharts for data visualization.

"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Gem,
  Trophy,
  Target,
  Activity,
  BarChart3,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Step 1: Define types for dashboard data
type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  avgCompletionRate: number;
  totalXP: number;
  totalGems: number;
  avgStreak: number;
  longestStreak: number;
};

// Step 2: Color palette for charts
const COLORS = {
  primary: "#1cb0f6",
  secondary: "#58cc02",
  accent: "#ff9600",
  danger: "#ff4b4b",
  purple: "#ce82ff",
  pink: "#ff66c4",
};

const CHART_COLORS = [
  "#1cb0f6",
  "#58cc02",
  "#ff9600",
  "#ce82ff",
  "#ff66c4",
  "#ffc800",
];

export default function AnalyticsDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // Default: 30 days
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Step 3: Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Step 3b: Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Force re-render by updating a state
      setIsLoadingStats(true);
      setTimeout(() => setIsLoadingStats(false), 100);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Step 4: Fetch data from Convex
  const allUsers = useQuery(api.analytics.getTotalUsers);
  const activeUsers = useQuery(api.analytics.getActiveUsers, { days: 7 });
  const appHealth = useQuery(api.analytics.getAppHealthDashboard);
  const topLessons = useQuery(api.analytics.getTopLessons, { limit: 10 });
  const strugglingLessons = useQuery(api.analytics.getStrugglingLessons, { limit: 5 });
  const streakStats = useQuery(api.analytics.getStreakStats);
  const resourceDistribution = useQuery(api.analytics.getResourceDistribution);

  // New time-based analytics
  const userGrowth = useQuery(api.analytics.getUserGrowthOverTime, { days: timeRange });
  const retentionMetrics = useQuery(api.analytics.getRetentionMetrics);
  const engagementOverTime = useQuery(api.analytics.getEngagementOverTime, { days: timeRange });

  // Alerts system
  const recentAlerts = useQuery(api.alerts.getRecentAlerts, { days: 7 });
  const unreadCount = useQuery(api.alerts.getUnreadAlertsCount);
  const dismissAlert = useMutation(api.alerts.dismissAlert);
  const generateAlerts = useMutation(api.alerts.generateAlerts);

  // Step 5: Calculate dashboard stats when data loads
  useEffect(() => {
    if (allUsers && appHealth && streakStats) {
      const usersList = allUsers.users || [];
      const activeUsersList = activeUsers?.users || [];

      setStats({
        totalUsers: allUsers.total || 0,
        activeUsers: activeUsers?.total || 0,
        totalLessons: appHealth.totalLessonsCompleted || 0,
        avgCompletionRate: appHealth.overallCompletionRate || 0,
        totalXP: usersList.reduce((sum, u) => sum + (u.xp || 0), 0),
        totalGems: usersList.reduce((sum, u) => sum + (u.gems || 0), 0),
        avgStreak: streakStats.averageStreak || 0,
        longestStreak: streakStats.longestStreak || 0,
      });
      setIsLoadingStats(false);
    }
  }, [allUsers, activeUsers, appHealth, streakStats]);

  // Step 6: Prepare chart data for lesson completion by section
  const lessonCompletionData = appHealth?.lessonCompletionBySection
    ? Object.entries(appHealth.lessonCompletionBySection).map(([section, data]: [string, any]) => ({
        section: `Section ${section.toUpperCase()}`,
        completed: data.completedCount,
        total: data.totalLessons,
        rate: data.completionRate,
      }))
    : [];

  // Step 7: Prepare chart data for resource distribution
  const resourceData = resourceDistribution
    ? [
        { name: "0-100 XP", count: resourceDistribution.xpDistribution["0-100"] || 0 },
        { name: "100-500 XP", count: resourceDistribution.xpDistribution["100-500"] || 0 },
        { name: "500-1000 XP", count: resourceDistribution.xpDistribution["500-1000"] || 0 },
        { name: "1000-5000 XP", count: resourceDistribution.xpDistribution["1000-5000"] || 0 },
        { name: "5000+ XP", count: resourceDistribution.xpDistribution["5000+"] || 0 },
      ]
    : [];

  // Step 8: Prepare top lessons data
  const topLessonsData = topLessons
    ? topLessons.slice(0, 10).map((lesson) => {
        const title = lesson.lessonTitle || lesson.lessonId || "Unknown Lesson";
        return {
          name: title.length > 20
            ? title.substring(0, 20) + "..."
            : title,
          completions: lesson.totalCompletions || 0,
          avgScore: lesson.averageScore || 0,
        };
      })
    : [];

  // Step 9: Prepare struggling lessons data
  const strugglingLessonsData = strugglingLessons
    ? strugglingLessons.map((lesson) => {
        const title = lesson.lessonTitle || lesson.lessonId || "Unknown Lesson";
        return {
          name: title.length > 25
            ? title.substring(0, 25) + "..."
            : title,
          score: lesson.averageScore || 0,
          attempts: lesson.totalAttempts || 0,
        };
      })
    : [];

  // Step 10: Prepare user activity data (active vs inactive)
  const userActivityData = allUsers
    ? [
        { name: "Active (7 days)", value: activeUsers?.total || 0, color: COLORS.secondary },
        { name: "Inactive", value: (allUsers.total || 0) - (activeUsers?.total || 0), color: COLORS.danger },
      ]
    : [];

  // Step 11: Prepare funnel data (user journey)
  const funnelData = allUsers && appHealth
    ? [
        { stage: "Signups", count: allUsers.total || 0, rate: 100 },
        {
          stage: "Started Lesson",
          count: appHealth.totalLessonsCompleted > 0 ? Math.min(allUsers.total, appHealth.totalLessonsCompleted) : 0,
          rate: allUsers.total > 0 ? ((appHealth.totalLessonsCompleted > 0 ? Math.min(allUsers.total, appHealth.totalLessonsCompleted) : 0) / allUsers.total * 100).toFixed(1) : 0
        },
        {
          stage: "5+ Lessons",
          count: appHealth.totalLessonsCompleted >= 5 ? Math.floor(appHealth.totalLessonsCompleted / 5) : 0,
          rate: allUsers.total > 0 ? ((appHealth.totalLessonsCompleted >= 5 ? Math.floor(appHealth.totalLessonsCompleted / 5) : 0) / allUsers.total * 100).toFixed(1) : 0
        },
        {
          stage: "Active Users",
          count: activeUsers?.total || 0,
          rate: allUsers.total > 0 ? ((activeUsers?.total || 0) / allUsers.total * 100).toFixed(1) : 0
        },
      ]
    : [];

  // Step 12: Export dashboard to PDF
  const exportDashboard = async () => {
    if (!dashboardRef.current) {
      return;
    }
    try {
      // Step 12a: Configure html2canvas with compatibility options
      // ignoreElements skips unsupported elements, allowTaint handles cross-origin issues
      // useCORS enables CORS for images, onclone allows pre-processing the cloned DOM
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        backgroundColor: "#f8fafc",
        logging: true, // Enable logging for debugging
        allowTaint: true,
        useCORS: true,
        // Step 12b: Pre-process cloned DOM to convert modern CSS colors
        // This fixes the "lab" color function error by converting to standard formats
onclone: (clonedDoc) => {
          const elements = clonedDoc.querySelectorAll('*');
          let colorFixCount = 0;
          const problematicElements: any[] = [];

          elements.forEach((el: any, index: number) => {
            try {
              // Step 12c: AGGRESSIVE approach - Override ALL color-related properties
              // This prevents html2canvas from encountering lab() colors at all

              // For SVG elements - set inline styles to override computed styles
              if (el.tagName && (el.tagName.toLowerCase().startsWith('svg') || el.ownerSVGElement)) {
                const tagName = el.tagName.toLowerCase();

                // Get current fill/stroke BEFORE checking computed styles
                const currentFill = el.getAttribute('fill') || '';
                const currentStroke = el.getAttribute('stroke') || '';
                const currentColor = el.getAttribute('color') || '';

                // Log detailed SVG element info
                if (currentFill.includes('lab') || currentStroke.includes('lab') || currentColor.includes('lab')) {
                  problematicElements.push({ index, tag: tagName, fill: currentFill, stroke: currentStroke });
                }

                // If they contain lab colors, replace them
                if (currentFill && (currentFill.includes('lab') || currentFill.includes('lch') || currentFill.includes('oklch'))) {
                  el.setAttribute('fill', '#000000');
                  el.style.fill = '#000000';
                  colorFixCount++;
                }

                if (currentStroke && (currentStroke.includes('lab') || currentStroke.includes('lch') || currentStroke.includes('oklch'))) {
                  el.setAttribute('stroke', '#000000');
                  el.style.stroke = '#000000';
                  colorFixCount++;
                }

                // Special handling for text elements
                if (tagName === 'text' || tagName === 'tspan') {
                  if (!currentFill || currentFill === 'currentColor' || currentFill.includes('lab')) {
                    el.setAttribute('fill', '#000000');
                    el.style.fill = '#000000';
                    colorFixCount++;
                  }
                }

                // Handle paths, lines, circles, rects
                if (['path', 'line', 'circle', 'rect', 'polyline', 'polygon'].includes(tagName)) {
                  if (!currentStroke || currentStroke.includes('lab')) {
                    el.setAttribute('stroke', '#000000');
                    el.style.stroke = '#000000';
                    colorFixCount++;
                  }
                  if (!currentFill || currentFill === 'none' || currentFill.includes('lab')) {
                    // Keep fill:none for stroked elements, otherwise set black
                    if (currentFill !== 'none') {
                      el.setAttribute('fill', '#000000');
                      el.style.fill = '#000000';
                      colorFixCount++;
                    }
                  }
                }
              }

              // For ALL elements, override color/backgroundColor in inline style
              const styles = window.getComputedStyle(el);

              // Check ALL color-related properties in COMPUTED styles
              const colorProps = ['backgroundColor', 'color', 'fill', 'stroke', 'borderColor', 'outlineColor'];
              colorProps.forEach(prop => {
                const value = (styles as any)[prop];
                if (value && typeof value === 'string' && (value.includes('lab') || value.includes('lch') || value.includes('oklch'))) {
                  // Force override with !important
                  const fallback = prop === 'backgroundColor' ? '#ffffff' : '#000000';
                  el.style.setProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), fallback, 'important');
                  colorFixCount++;
                }
              });

              // CRITICAL: Also fix inline style attribute (raw HTML)
              const styleAttr = el.getAttribute('style');
              if (styleAttr && (styleAttr.includes('lab(') || styleAttr.includes('lch(') || styleAttr.includes('oklch('))) {
                }...`);

                // Remove all lab/lch/oklch color functions from inline style
                let fixedStyle = styleAttr
                  .replace(/lab\([^)]+\)/g, '#000000')
                  .replace(/lch\([^)]+\)/g, '#000000')
                  .replace(/oklch\([^)]+\)/g, '#000000');

                el.setAttribute('style', fixedStyle);
                colorFixCount++;
              }

            } catch (err) {
            }
          });
          if (problematicElements.length > 0) {
            );
          }

          // Final check: Look for any remaining lab colors in the DOM
          const allText = clonedDoc.documentElement.innerHTML;
          const labMatches = allText.match(/lab\([^)]+\)/g);
          if (labMatches && labMatches.length > 0) {
             references in DOM HTML!`);
            );
          } else {
             colors found in final DOM HTML");
          }
        },
      });
      const imgData = canvas.toDataURL("image/png");
      `);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add header
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(12);
      pdf.setTextColor(50);
      pdf.text("Analytics Dashboard Report", 10, 10);
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${timestamp}`, 10, 16);
      pdf.text(`Time Range: ${timeRange} days`, 10, 21);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      }mm`);

      let heightLeft = imgHeight;
      let position = 25;
      let pageCount = 1;

      ...");
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= 252;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 25;
        pdf.addPage();
        pageCount++;
        pdf.text("Analytics Dashboard Report", 10, 10);
        pdf.text(`Generated: ${timestamp}`, 10, 16);
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= 277;
      }

      const filename = `dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
      `);
      pdf.save(filename);
      // Show success message
      alert(`PDF exported successfully!\nFilename: ${filename}\nPages: ${pageCount}`);
    } catch (error) {
      .name,
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      alert(`Failed to export dashboard.\n\nError: ${(error as Error).message}\n\nCheck browser console for details.`);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // ✅ Authentication and data loading complete

  // Step 13: Render dashboard UI with charts
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600 text-lg">
                  Visual overview of your app's performance and user engagement
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Time Range Filter */}
              <button
                onClick={() => setTimeRange(7)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 7
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 30
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 90
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                90 Days
              </button>

              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  autoRefresh
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                title={autoRefresh ? `Auto-refreshing every 30s (Last: ${lastRefresh.toLocaleTimeString()})` : "Enable auto-refresh"}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'On' : 'Off'}
              </button>

              {/* Export PDF */}
              <button
                onClick={exportDashboard}
                className="px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingStats && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <span className="ml-3 text-xl text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoadingStats && stats && (
          <div ref={dashboardRef} className="space-y-6">
            {/* Alerts Panel - Always visible */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-orange-500" />
                  Active Alerts
                  {unreadCount && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => generateAlerts()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                >
                  Refresh Alerts
                </button>
              </div>

              {/* Show alerts if they exist, otherwise show empty state */}
              {recentAlerts && recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {recentAlerts
                    .filter(alert => !alert.dismissed)
                    .slice(0, 5)
                    .map((alert) => {
                      const Icon =
                        alert.severity === "critical"
                          ? AlertTriangle
                          : alert.severity === "warning"
                          ? AlertCircle
                          : Info;
                      const bgColor =
                        alert.severity === "critical"
                          ? "bg-red-50 border-red-200"
                          : alert.severity === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200";
                      const iconColor =
                        alert.severity === "critical"
                          ? "text-red-500"
                          : alert.severity === "warning"
                          ? "text-yellow-500"
                          : "text-blue-500";

                      return (
                        <div
                          key={alert._id}
                          className={`p-4 rounded-lg border ${bgColor} flex items-start justify-between`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                            <div>
                              <p className="font-semibold text-gray-800">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => dismissAlert({ alertId: alert._id })}
                            className="p-1 hover:bg-gray-200 rounded transition-all"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      );
                    })}
                  {recentAlerts.filter(a => !a.dismissed).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No active alerts. Everything looks good!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No alerts yet. Click "Refresh Alerts" to generate alerts based on current data.</p>
                </div>
              )}
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.activeUsers} active (7 days)
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Total Lessons */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Lessons Completed</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalLessons}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.avgCompletionRate.toFixed(1)}% avg completion
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BookOpen className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Total XP */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total XP Earned</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {stats.totalXP.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(stats.totalXP / stats.totalUsers)} avg per user
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Zap className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Longest Streak</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {stats.longestStreak} days
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.avgStreak.toFixed(1)} avg streak
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Trophy className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: User Growth Chart & Retention Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Over Time */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  User Growth ({timeRange} Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowth || []}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="signups"
                      stroke={COLORS.secondary}
                      fillOpacity={1}
                      fill="url(#colorSignups)"
                      name="Daily Signups"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorCumulative)"
                      name="Total Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Retention Metrics */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-500" />
                  Retention Rates
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={
                      retentionMetrics
                        ? [
                            { period: "Day 1", rate: parseFloat(retentionMetrics.day1.rate), returned: retentionMetrics.day1.returned, total: retentionMetrics.day1.total },
                            { period: "Day 7", rate: parseFloat(retentionMetrics.day7.rate), returned: retentionMetrics.day7.returned, total: retentionMetrics.day7.total },
                            { period: "Day 30", rate: parseFloat(retentionMetrics.day30.rate), returned: retentionMetrics.day30.returned, total: retentionMetrics.day30.total },
                          ]
                        : []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis label={{ value: "Retention %", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 shadow-lg rounded-lg border">
                              <p className="font-bold">{data.period}</p>
                              <p className="text-sm">Rate: {data.rate}%</p>
                              <p className="text-sm">{data.returned} / {data.total} users returned</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="rate" fill={COLORS.purple} name="Retention %" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {retentionMetrics?.day1.rate || 0}%
                    </p>
                    <p className="text-xs text-gray-600">Day 1</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {retentionMetrics?.day7.rate || 0}%
                    </p>
                    <p className="text-xs text-gray-600">Day 7</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {retentionMetrics?.day30.rate || 0}%
                    </p>
                    <p className="text-xs text-gray-600">Day 30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Over Time & User Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Over Time */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-orange-500" />
                  Daily Engagement ({timeRange} Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementOverTime || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="activeUsers"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      name="Active Users"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="lessonsCompleted"
                      stroke={COLORS.secondary}
                      strokeWidth={2}
                      name="Lessons Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Funnel */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Filter className="w-6 h-6 text-indigo-500" />
                  User Journey Funnel
                </h3>
                <div className="space-y-4 mt-6">
                  {funnelData.map((stage, index) => {
                    const width = stage.rate;
                    const color =
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-green-500" :
                      index === 2 ? "bg-yellow-500" :
                      "bg-purple-500";

                    return (
                      <div key={stage.stage} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">{stage.stage}</span>
                          <span className="text-sm text-gray-600">{stage.count} users ({stage.rate}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div
                            className={`${color} h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500`}
                            style={{ width: `${width}%` }}
                          >
                            {width > 15 && `${stage.rate}%`}
                          </div>
                        </div>
                        {index < funnelData.length - 1 && (
                          <div className="flex justify-center my-1">
                            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-300"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Conversion Rate:</strong> {funnelData[funnelData.length - 1]?.rate}% of signups become active users
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Row 1: User Activity & XP Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-500" />
                  User Activity (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* XP Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-orange-500" />
                  XP Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2: Top Lessons & Lesson Completion by Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Lessons */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Top 10 Lessons (Most Completed)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topLessonsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="completions" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Lesson Completion by Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-500" />
                  Completion Rate by Section
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={lessonCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="section" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill={COLORS.secondary} name="Completed" />
                    <Bar dataKey="total" fill={COLORS.primary} name="Total Lessons" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 3: Struggling Lessons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-red-500" />
                Struggling Lessons (Lowest Scores)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strugglingLessonsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill={COLORS.danger} name="Avg Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Gems */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold">Total Gems</p>
                    <p className="text-3xl font-bold mt-1">{stats.totalGems.toLocaleString()}</p>
                  </div>
                  <Gem className="w-12 h-12 text-blue-200" />
                </div>
              </div>

              {/* Active Streaks */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold">Users with Streaks</p>
                    <p className="text-3xl font-bold mt-1">
                      {streakStats?.usersWithStreaks || 0}
                    </p>
                  </div>
                  <Zap className="w-12 h-12 text-orange-200" />
                </div>
              </div>

              {/* Avg Hearts */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-semibold">Avg Hearts</p>
                    <p className="text-3xl font-bold mt-1">
                      {resourceDistribution?.averageHearts?.toFixed(1) || "0"}
                    </p>
                  </div>
                  <Heart className="w-12 h-12 text-red-200" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Complete analytics dashboard with:
// - Key metric cards (users, lessons, XP, streaks)
// - Pie chart for user activity
// - Bar charts for XP distribution, top lessons, struggling lessons
// - Section completion rate visualization
// - Gradient metric cards for gems, streaks, hearts
// - Responsive layout with Recharts
