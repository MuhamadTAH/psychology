// Simple Avatar component for user profiles
// Displays a colored circle with the first letter of the theme

interface AvatarProps {
    theme?: string;
    size?: number;
    animate?: boolean;
}

export default function Avatar({ theme = "/Profile image/1.jpg", size = 40, animate = false }: AvatarProps) {
    // Determine the final image URL to render: 
    // If it's a known non-url format (like 'red', 'default'), force it to the basic image
    const finalImageUrl = (theme.startsWith("/") || theme.startsWith("http"))
        ? theme
        : "/Profile image/1.jpg";

    return (
        <img
            src={finalImageUrl}
            alt="Avatar"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                transition: animate ? "all 0.3s ease" : "none",
            }}
        />
    );
}
