export const employee = {
  name: 'app.Employee',
  component: 'User',
  isStore: true,
  fields: [
    {
      component: 'PersonNameField',
      name: 'firstName',
      label: 'First Name',
      required: true,
      block: false,
      before: 'username'
    },
    {
      component: 'PersonNameField',
      name: 'lastName',
      label: 'Last Name',
      required: true,
      before: 'username'
    },
    {
      name: 'departments',
      label: 'Departments',
      component: 'SelectField',

      // TODO: is this really the best way to handle this? A better alternative is probably to load
      // the options in the backend as well.
      ensureInList: false,
      multiple: true
    },
    {
      component: 'SelectField',
      name: 'roles',
      label: 'Roles',
      multiple: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' }
      ]
    }
  ],
  roles: ['employee'],
  access: {
    form: {
      create: ['admin', 'manager'],
      read: ['admin', 'employee'],
      update: ['admin', 'owner', 'manager'],
      archive: ['admin']
    },
    fields: {
      password: {
        update: ['admin', 'owner']
      },
      roles: {
        create: 'admin',
        update: 'admin'
      },
      departments: {
        create: 'manager',
        update: 'manager'
      }
    }
  }
};

export const department = {
  name: 'app.Department',
  component: 'Form',
  isStore: true,
  fields: [
    {
      component: 'PersonNameField',
      name: 'name',
      label: 'Name',
      required: true
    },
    {
      component: 'TextField',
      name: 'privateNotes',
      label: 'Private Notes',
      required: false
    }
  ],
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ],
  access: {
    form: {
      create: 'manager',
      read: ['manager', 'employee'],
      update: 'manager',
      archive: 'manager'
    },
    fields: {
      privateNotes: {
        create: ['manager'],
        read: ['manager'],
        update: ['manager']
      }
    }
  }
};

export const login = {
  name: 'app.Login',
  component: 'Login',
  listeners: [
    {
      event: 'signUp',
      actions: [
        {
          component: 'Redirect',
          path: '/signup'
        }
      ]
    },
    {
      event: 'forgotPassword',
      actions: [
        {
          component: 'Redirect',
          path: '/reset-password'
        }
      ]
    },
    {
      event: 'contact',
      actions: [
        {
          component: 'Redirect',
          path: '/contact-us'
        }
      ]
    }
  ]
};

export const changePassword = {
  name: 'app.ChangePassword',
  component: 'UpdatePasswordEditor',
  updatePasswordBaseForm: 'app.Employee',
  storeName: 'app.Employee',
  listeners: [
    {
      event: ['didSave', 'cancel'],
      actions: [
        {
          component: 'Redirect',
          path: '/account'
        }
      ]
    }
  ]
};

export const employeeSignup = {
  name: 'app.EmployeeSignup',
  component: 'SignupEditor',
  signupBaseForm: 'app.Employee',
  storeName: 'app.Employee'
};

export const getDepartments = {
  name: 'app.GetDepartments',
  component: 'Action',
  actions: [
    {
      component: 'GetRecords',
      storeName: 'app.Department',

      // Hide archived departments so that the user cannot select them
      where: {
        archivedAt: null
      }
    },
    {
      component: 'Iterator',
      iterator: 'arguments.edges',
      return: {
        value: '{{item.node.id}}',
        label: '{{item.node.fieldValues.name}}'
      }
    }
  ]
};

export const viewAndEditAccount = {
  name: 'app.ViewAndEditAccount',
  component: 'RecordEditor',
  baseForm: 'app.Employee',
  label: 'Account',
  storeWhere: {
    userId: '{{globals.session.user.id}}'
  },
  storeName: 'app.Employee',
  listeners: [
    {
      event: 'load',
      actions: [
        {
          component: 'app.GetDepartments'
        },
        {
          component: 'Set',
          name: 'fields.departments.options'
        }
      ]
    }
  ]
};

export const employees = {
  name: 'app.Employees',
  component: 'Form',
  fields: [
    {
      name: 'employees',
      label: 'Employees',
      component: 'UserList',
      baseForm: 'app.Employee',
      storeName: 'app.Employee',
      listeners: [
        {
          event: 'load',
          actions: [
            {
              component: 'app.GetDepartments'
            },
            {
              component: 'Set',
              name: 'form.fields.departments.options'
            }
          ]
        }
      ]
    }
  ]
};

export const departments = {
  name: 'app.Departments',
  component: 'RecordList',
  label: 'Departments',
  baseForm: 'app.Department',
  storeName: 'app.Department'
};

export const resetPasswordEditor = {
  name: 'ResetPasswordEditor',
  component: 'ResetPassword',
  fields: [
    {
      component: 'ButtonField',
      type: 'submit',
      name: 'reset',
      label: 'Reset',
      icon: 'LockOpen'
    },
    {
      component: 'ButtonField',
      name: 'cancel',
      label: 'Cancel',
      icon: 'Cancel'
    }
  ],
  listeners: [
    {
      event: 'reset',
      actions: [
        {
          component: 'UpsertRecord',
          storeName: 'ResetPassword'
        },
        {
          component: 'Snackbar',
          message: 'Please expect an email shortly'
        },
        {
          component: 'Redirect',
          path: '/'
        }
      ]
    },
    {
      event: 'cancel',
      actions: [
        {
          component: 'Redirect',
          path: '/'
        }
      ]
    }
  ]
};

export const contactUsShared = {
  name: 'app.ContactUsShared',
  component: 'ContactUs',
  to: '"Support" <support@example.com>'
  // body: 'header<br/>{{fields.body.value}}<br/>footer',
};

export const contactUs = {
  name: 'app.ContactUs',
  component: 'app.ContactUsShared',
  storeName: 'app.ContactUs',
  listeners: [
    {
      event: 'create',
      actions: [
        {
          component: 'Set',
          name: 'fields.captcha.hidden',
          value: true
        }
      ]
    }
  ],
  access: {
    form: {
      create: ['admin', 'employee']
    }
  }
};

export const publicContactUs = {
  name: 'app.PublicContactUs',
  component: 'app.ContactUsShared',
  storeName: 'app.PublicContactUs'
};

const menuItems = [
  {
    path: '/employees',
    label: 'Employees',
    content: {
      component: 'app.Employees'
    },
    roles: ['admin', 'employee']
  },
  {
    path: '/departments',
    label: 'Departments',
    content: {
      component: 'app.Departments'
    },
    roles: ['manager']
  },
  {
    label: 'My Account',
    items: [
      {
        path: '/account',
        label: 'Account',
        content: {
          component: 'app.ViewAndEditAccount'
        }
      },
      {
        path: '/account/change-password',
        label: 'Change Password',
        content: {
          component: 'app.ChangePassword'
        }
      }
    ],
    roles: ['admin', 'employee']
  },
  {
    path: '/public',
    hidden: true,
    items: [
      {
        path: '/',
        content: {
          component: 'Action',
          actions: [
            {
              if: {
                globals: {
                  session: {
                    user: {
                      roleNames: {
                        $in: ['admin', 'manager']
                      }
                    }
                  }
                }
              },
              component: 'Redirect',
              path: '/employees'
            },
            {
              if: {
                globals: {
                  session: {
                    user: {
                      roleNames: {
                        $nin: ['admin', 'manager']
                      }
                    }
                  }
                }
              },
              component: 'Redirect',
              path: '/account'
            }
          ]
        },
        // Force the user to be logged in before the actions above are executed
        roles: ['admin', 'employee']
      },
      {
        path: '/login',
        label: 'Login',
        content: {
          component: 'Card',
          title: 'Login',
          content: {
            component: 'app.Login'
          }
        },
        fullScreen: true
      },
      {
        path: '/signup',
        label: 'Signup',
        content: {
          component: 'Card',
          title: 'Signup',
          content: {
            component: 'app.EmployeeSignup'
          }
        },
        fullScreen: true
      },
      {
        path: '/reset-password',
        content: {
          component: 'Card',
          title: 'Reset Password',
          content: {
            component: 'ResetPasswordEditor'
          }
        },
        fullScreen: true
      },
      {
        path: '/contact-us',
        content: {
          component: 'Card',
          title: 'Contact Us',
          content: {
            component: 'app.PublicContactUs'
          }
        },
        fullScreen: true
      }
    ]
  },
  {
    path: '/contact',
    label: 'Contact',
    content: {
      component: 'app.ContactUs'
    },
    roles: ['admin', 'employee']
  },
  {
    path: '/logout',
    label: 'Logout',
    content: {
      component: 'Action',
      actions: [
        {
          component: 'LogOutOfApp'
        },
        {
          component: 'Redirect',
          path: '/login'
        }
      ]
    },
    roles: ['admin', 'employee']
  }
];

export const app = {
  name: 'app.App',
  component: 'App',
  menu: {
    component: 'Menu',
    items: menuItems
  },
  listeners: [
    {
      event: 'loggedOut',
      actions: [
        {
          component: 'Redirect',
          path: '/login'
        }
      ]
    }
  ]
};
