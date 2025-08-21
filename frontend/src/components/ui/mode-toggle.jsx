import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { SunIcon, MoonIcon, LaptopIcon } from "@radix-ui/react-icons";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          {theme === "dark" ? <MoonIcon /> : theme === "light" ? <SunIcon /> : <LaptopIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}> <SunIcon className="mr-2" /> Light </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}> <MoonIcon className="mr-2" /> Dark </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}> <LaptopIcon className="mr-2" /> System </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
