const roles = {
  roles: [
    {
      name: "administrator",
      permissions: [
        "read_dashboard",
        "create_tasks", "read_tasks", "update_tasks", "delete_tasks",
        "create_teams", "read_teams", "update_teams", "delete_teams",
        "create_projects", "read_projects", "update_projects", "delete_projects",
        "create_users", "read_users", "update_users", "delete_users",
        "create_classrooms", "read_classrooms", "update_classrooms", "delete_classrooms",
        "create_comments", "read_comments", "update_comments", "delete_comments",
        "read_analytics",
        "read_completions",
        "read_settings",
        "create_notifications", "read_notifications", "update_notifications", "delete_notification",
        "read_security", "update_security"
      ]
    },
    {
      name: "instructor",
      permissions: [
        "read_dashboard",
        "create_tasks", "read_tasks", "update_tasks", "delete_tasks",
        "create_projects", "read_projects", "update_projects", "delete_projects",
        "create_teams", "read_teams", "update_teams", "delete_teams",
        "create_users", "read_users", "update_users", "delete_users",
        "create_classrooms", "read_classrooms", "update_classrooms", "delete_classrooms",
        "create_comments", "read_comments", "update_comments",
        "read_analytics",
        "read_completions",
        "read_settings",
        "create_notifications", "read_notifications", "update_notifications"
      ]
    },
    {
      name: "student",
      permissions: [
        "read_dashboard",
        "read_tasks", "update_tasks",
        "read_projects", "update_projects",
        "read_classrooms",
        "create_comments", "read_comments", "update_comments"
      ]
    }
  ]
}

export default roles