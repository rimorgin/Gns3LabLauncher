export const HTTP_RESPONSE_CODE = {
  NOT_FOUND: 404,
  CREATED: 201,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
};

export const enum HttpStatusCode {
  NOT_FOUND = 404,
  CREATED = 201,
  CONFLICT = 409,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
}

export const APP_RESPONSE_MESSAGE = {
  serverError: "Something went wrong, try again later",
  user: {
    // User messages
    userDoesExist: "User already exists",
    userDoesntExist: "User does not exist",
    userUnauthorized:
      "Unauthorized: You must be logged in to access this resource.",
    userDoesntHavePerms:
      "Unauthorized: You do not have permission to access this resource.",
    invalidCredentials: "Invalid user email or password",
    invalidCsrfToken: "Invalid CSRF token. Please refresh and try again.",
    userReturned: "User returned successfully",
    usersReturned: "Users returned successfully",
    userCreated: "User created successfully",
    userUpdated: "User updated successfully",
    userDeleted: "User deleted successfully",
    userLoggedIn: "Logged in successfully",
    userLoggedOut: "Logged out successufully",
  },

  // UserGroup messages
  userGroup: {
    userGroupReturned: "User group returned successfully",
    userGroupsReturned: "User groups returned successfully",
    userGroupCreated: "User group created successfully",
    userGroupUpdated: "User group updated successfully",
    userGroupDeleted: "User group deleted successfully",
    userGroupDoesExist: "User group already exists",
    userGroupDoesntExist: "User group does not exist",
  },
  // Classroom messages
  classroom: {
    classroomReturned: "Classroom returned successfully",
    classroomsReturned: "Classrooms returned successfully",
    classroomCreated: "Classroom created successfully",
    classroomUpdated: "Classroom updated successfully",
    classroomDeleted: "Classroom deleted successfully",
    classroomDoesExist: "Classroom already exists",
    classroomDoesntExist: "Classroom does not exist",
  },

  // Project messages
  project: {
    projectReturned: "Project returned successfully",
    projectsReturned: "Projects returned successfully",
    projectCreated: "Project created successfully",
    projectUpdated: "Project updated successfully",
    projectDeleted: "Project deleted successfully",
    projectDoesExist: "Project already exists",
    projectDoesntExist: "Project does not exist",
  },

  // Course messages
  course: {
    courseReturned: "Course returned successfully",
    coursesReturned: "Courses returned successfully",
    courseCreated: "Course created successfully",
    courseUpdated: "Course updated successfully",
    courseDeleted: "Course deleted successfully",
    courseDoesExist: "Course already exists",
    courseDoesntExist: "Course does not exist",
  },
};

export const literals = {
  user: "user",
};
