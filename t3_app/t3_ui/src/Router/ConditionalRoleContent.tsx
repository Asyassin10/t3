import { RoleText } from "@/types/AppTypes";
type ConditionalRoleContentProps = {
  children: React.ReactNode;
  user_role: RoleText;
  allowed_roles: RoleText[];
};
const ConditionalRoleContent = ({
  children,
  user_role,
  allowed_roles,
}: ConditionalRoleContentProps) => {
  if (user_role && allowed_roles.includes(user_role)) {
    return <>{children}</>;
  }
  return <></>
};
export default ConditionalRoleContent;
