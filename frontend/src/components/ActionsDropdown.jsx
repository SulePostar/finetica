import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function ActionsDropdown({ item, actions, onAction }) {
  const handleAction = (actionKey, event) => {
    if (onAction) {
      onAction(actionKey, item, event);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <div key={action.key || index}>
            {action.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={(e) => handleAction(action.key, e)}
              className={action.className}
              disabled={action.disabled}
            >
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}