import { Avatar, AvatarFallback, AvatarImage } from '@/shadcnuicomponents/ui/avatar'
import { Button } from '@/shadcnuicomponents/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shadcnuicomponents/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom';
import api_client from '@/axios/api_client';
import { useAtom } from 'jotai';
import { json_t3_modules_atom, json_t3_token, json_t3_user } from '@/state/atom';

export function UserNav() {
  const navigate = useNavigate();
  const [user, setT3User] = useAtom(json_t3_user);
  const [token, setT3Token] = useAtom(json_t3_token);
  const [modules, setT3Modules] = useAtom(json_t3_modules_atom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative w-8 h-8 rounded-full'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => {
            navigate("/profile", { replace: true });
          }}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            navigate("/app/app-data", { replace: true });
          }}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            api_client.post('/logout', {}, {
              headers: {
                Authorization: "Bearer " + token,
              }
            }).then(() => {
              localStorage.removeItem('t3_user');
              localStorage.removeItem('t3_token');
              localStorage.removeItem('t3_modules');
              setT3Modules(modules);
              setT3User(user);
              setT3Token(token);
              navigate("/auth/signing", { replace: true });

            })
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
