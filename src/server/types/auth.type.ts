/**
 * Represents the possible role names in the application.
 */
export type RoleName = "administrator" | "instructor" | "student";

/**
 * Represents the possible permissions that can be assigned to roles.
 */
export type Permission =
  | "read_dashboard"
  | "read_lectures"
  | "create_lectures"
  | "update_lectures"
  | "delete_lectures"
  | "read_courses"
  | "create_courses"
  | "update_courses"
  | "delete_courses"
  | "create_tasks"
  | "read_tasks"
  | "update_tasks"
  | "delete_tasks"
  | "create_teams"
  | "read_teams"
  | "update_teams"
  | "delete_teams"
  | "create_projects"
  | "read_projects"
  | "update_projects"
  | "delete_projects"
  | "create_project-labs"
  | "read_project-labs"
  | "update_project-labs"
  | "delete_project-labs"
  | "create_users"
  | "read_users"
  | "update_users"
  | "delete_users"
  | "create_user-groups"
  | "read_user-groups"
  | "update_user-groups"
  | "delete_user-groups"
  | "create_classrooms"
  | "read_classrooms"
  | "update_classrooms"
  | "delete_classrooms"
  | "create_calendar"
  | "read_calendar"
  | "update_calendar"
  | "delete_calendar"
  | "create_comments"
  | "read_comments"
  | "update_comments"
  | "delete_comments"
  | "read_analytics"
  | "read_completions"
  | "read_settings"
  | "read_data_library"
  | "read_system_health"
  | "read_system_logs"
  | "create_notifications"
  | "read_notifications"
  | "update_notifications"
  | "delete_notification"
  | "read_security"
  | "update_security"
  | "create_cron-jobs"
  | "read_cron-jobs"
  | "update_cron-jobs"
  | "delete_cron-jobs";

/**
 * Represents a role with a name and a set of permissions.
 */
export interface Role {
  /**
   * The name of the role.
   */
  name: RoleName;
  /**
   * The permissions assigned to the role.
   */
  permissions: Permission[];
}

/**
 * Represents a collection of roles.
 */
export interface RolesCollection {
  /**
   * An array of roles.
   */
  roles: Role[];
}
