import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/shared/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage 
          alt="Picture" 
          src={user.image} 
          referrerPolicy="no-referrer" 
          crossOrigin="anonymous"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          {user.name ? (
            <span className="font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <Icons.user className="size-4" />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
