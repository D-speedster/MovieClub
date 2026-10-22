export type Role = "User" | "Admin" | "Owner";
export function canManageUser(actor: { id: string; role: Role }, target: { id: string; role: Role }, nextRole?: Role) {
 if(actor.id===target.id || actor.role==='User') return false;
 // Owner accounts cannot be demoted or deleted through normal user management.
 if(target.role==='Owner') return false;
 if(nextRole==='Owner') return actor.role==='Owner';
 return actor.role==='Owner' || actor.role==='Admin';
}
