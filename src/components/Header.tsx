import { Link } from '@tanstack/react-router'
import { Button } from '@heroui/button'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import { Avatar } from '@heroui/avatar'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Activity, ChevronDown, Flashlight, Scale, Server, User } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const logOut = useAuthStore((state) => state.logout)

  return (
    <Navbar isBordered isBlurred onMenuOpenChange={setIsMenuOpen} maxWidth='xl'>
      <NavbarContent justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to='/'>
            <h1 className='text-xl font-bold'>Entretenimiento</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='center' className='hidden sm:flex'>


        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="text-foreground bg-transparent data-[hover=true]:bg-transparent"
                endContent={<ChevronDown />}
                variant="light"
              >
                Features
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps based on demand and load"
              startContent={<Scale className='text-yellow-500' />}
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues"
              startContent={<Activity className='text-purple-500' />}
            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us at web scale"
              startContent={<Flashlight className='text-blue-500' />}
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="High availability and uptime guarantees"
              startContent={<Server className='text-green-500' />}
            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
              key="supreme_support"
              description="Support team ready to respond"
              startContent={<User className='text-red-500' />}
            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* <NavbarContent justify='end'>
        <Chip color='success' variant='bordered'>Logged In</Chip>
        <Button color='danger' isIconOnly startContent={<LogOut className='text-foreground' size={18} />} size='sm' />
      </NavbarContent> */}

      <NavbarContent justify='end'>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Marvin Campos"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Sesión iniciada como</p>
              <p className="font-semibold">marvincampos@itc.ac.cr</p>
            </DropdownItem>
            <DropdownItem key="settings">
              <Link to='/provider/$id' params={{ id: 'user-1' }}>Perfil</Link>
            </DropdownItem>
            <DropdownItem key="settings">Ajustes</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={logOut}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>



      <NavbarMenu>
        <NavbarMenuItem>
          <Link to='/'>Home</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link to='/provider/$id' params={{ id: 'user-1' }}>Perfil</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}