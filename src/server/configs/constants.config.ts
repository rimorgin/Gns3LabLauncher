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
  server: {
    error: "An unexpected error occurred. Please try again later.",
    notFound: "Resource not found",
  },
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

export const images = {
  courseImages: [
    {
      name: "alpine-forest",
      src: "/static/images/courses/9f9c813d-d96a-46dc-bd19-6f7b658d218e.jpg",
    },
    {
      name: "azure-sky",
      src: "/static/images/courses/b146bd30-776a-4052-afab-24103530d50b.jpg",
    },
    {
      name: "crimson-sunset",
      src: "/static/images/courses/b899dcd9-9d1b-4a19-97c0-6c2e0d157f5e.jpg",
    },
    {
      name: "emerald-lake",
      src: "/static/images/courses/fb608910-bafe-43d4-87a0-2a47e81356ef.jpg",
    },
    {
      name: "golden-meadow",
      src: "/static/images/courses/4c4e0c3b-bf85-4081-989b-8e3ea4a57bd5.jpg",
    },
    {
      name: "silent-harbor",
      src: "/static/images/courses/721cb2f0-5168-409a-b178-79728ed92e37.jpg",
    },
    {
      name: "misty-mountain",
      src: "/static/images/courses/156008b4-1855-4d09-ade4-07e4082eb333.jpg",
    },
    {
      name: "silver-river",
      src: "/static/images/courses/f86c62db-cfd6-4a02-b5b3-1d078fc4445c.jpg",
    },
    {
      name: "autumn-valley",
      src: "/static/images/courses/9b10ab1d-ea21-4d94-8af4-013ce21624cf.jpg",
    },
    {
      name: "frosty-peak",
      src: "/static/images/courses/6ecc0531-e6d0-453e-8fe7-750cd018f88a.jpg",
    },
    {
      name: "sunny-hills",
      src: "/static/images/courses/f95ab719-ed40-44c0-b248-2952c4118eee.jpg",
    },
    {
      name: "quiet-cove",
      src: "/static/images/courses/936ef989-53d2-4dfc-b7ce-7254ec2ff936.jpg",
    },
    {
      name: "hidden-grove",
      src: "/static/images/courses/e75380af-8b60-4c26-a676-8868f6645965.jpg",
    },
    {
      name: "willow-creek",
      src: "/static/images/courses/e75380af-8b60-4c26-a676-8868f6645965.jpg",
    },
    {
      name: "pine-ridge",
      src: "/static/images/courses/4a4118ab-b27d-44ae-90ba-b1e48be85f79.jpg",
    },
  ],
  userGroupImages: [
    {
      name: "crazy-groups",
      src: "/static/images/groups/6ddaf776-ebf9-4cae-91cd-1a1b95b89857.jpg",
    },
    {
      name: "azure-groups",
      src: "/static/images/groups/794e9a10-dd3b-4e75-97e9-dd8500fcc073.jpg",
    },
    {
      name: "groups-sunset",
      src: "/static/images/groups/0917a030-8ec5-44db-bc5f-623382437bec.jpg",
    },
    {
      name: "emerald-group",
      src: "/static/images/groups/c256245f-e63a-402b-81a3-688b57c28bda.jpg",
    },
  ],
  projectImages: [
    {
      name: "physical-topology",
      src: "/static/images/projects/1751433310.png",
      tags: "networking",
    },
    {
      name: "data-center",
      src: "/static/images/projects/4335662a-470a-42cc-af9b-7cd6b604b9de.jpg",
      tags: "networking",
    },
    {
      name: "data-center-2",
      src: "/static/images/projects/37bd2db6-bbd0-4524-93bc-ff5511f96f09.jpg",
      tags: "networking",
    },
    {
      name: "routers-and-switches",
      src: "/static/images/projects/8ba2115e-f708-4f8e-830e-9eb0d2da5332.jpg",
      tags: "networking",
    },
    {
      name: "routers-and-switches-2",
      src: "/static/images/projects/6c78003d-dbea-402d-99f2-9aac39e8ebb4.jpg",
      tags: "networking",
    },
    {
      name: "routers-and-switches-3",
      src: "/static/images/projects/7df2a902-d302-44ab-934d-abcd290ae2a1.jpg",
      tags: "networking",
    },
    {
      name: "hacking-guy",
      src: "/static/images/projects/dc31b93e-be9d-4d32-bafc-39fbb759cdf9.jpg",
      tags: "cybersecurity",
    },
    {
      name: "security-engineer",
      src: "/static/images/projects/b46c0a05-53a0-4a4a-932b-13502e5c96ef.jpg",
      tags: "cyberscurity",
    },
    {
      name: "malicious-attacker",
      src: "/static/images/projects/7e4efece-6b33-4fc8-a421-9c3bcfb79f25.jpg",
      tags: "cybersecurity",
    },
  ],
};
