import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"
import Image from "next/image"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from "@/components/shared/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square size-full">
          <Image
            fill
            src={user.image}
            alt="Profile picture"
            referrerPolicy="no-referrer"
            className="rounded-full object-cover"
            priority
          />
        </div>
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
