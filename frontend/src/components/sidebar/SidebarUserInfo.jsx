export const SidebarUserInfo = ({ user }) => (
    <div className="flex items-center gap-3">
        <div className="bg-[#6C69FF] text-white flex size-10 rounded-full items-center justify-center font-semibold">
            {user.profileImage ? (
                <img src={user.profileImage} className="rounded-full size-full object-cover" alt="" />
            ) : (
                user.initials
            )}
        </div>
        <div className="flex flex-col leading-tight text-sm">
            <span className="font-medium text-foreground">{user.name}</span>
            <span className="text-muted-foreground">{user.email}</span>
        </div>
    </div>
);
