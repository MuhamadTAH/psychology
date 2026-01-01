// Simple Avatar component for user profiles
// Displays a colored circle with the first letter of the theme

interface AvatarProps {
    theme?: string;
    size?: number;
    animate?: boolean;
}

export default function Avatar({ theme = "default", size = 40, animate = false }: AvatarProps) {
    // Color mapping for different themes
    const themeColors: Record<string, string> = {
        default: "#3B82F6", // Blue
        red: "#EF4444",
        green: "#10B981",
        purple: "#8B5CF6",
        orange: "#F59E0B",
        pink: "#EC4899",
        cyan: "#06B6D4",
    };

    const bgColor = themeColors[theme] || themeColors.default;
    const letter = theme.charAt(0).toUpperCase();

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: size * 0.5,
                transition: animate ? "all 0.3s ease" : "none",
            }}
        >
            {letter}
        </div>
    );
}
