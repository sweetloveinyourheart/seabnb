import AuthGuard from "@/features/Authentication/guards/AuthGuard"

export default function AccoutSettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <AuthGuard>
            {children}
        </AuthGuard>
    )
}
